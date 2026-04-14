import json
import logging
import os
import re
import smtplib
from collections import Counter
from datetime import datetime, timezone
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from functools import wraps
from logging.handlers import RotatingFileHandler
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
PREGUNTAS_PATH = BASE_DIR / "preguntas.json"
REGISTROS_PATH = BASE_DIR / "registros.json"

EMAIL_REGEX = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
MAX_NOMBRE_LENGTH = 90
MIN_EDAD = 10
MAX_EDAD = 25
TOTAL_PREGUNTAS = 105
PUNTAJE_MIN = 1
PUNTAJE_MAX = 5

ESPECIALIDADES = [
    "Dietética",
    "Programación",
    "Ciberseguridad",
    "Electricidad",
    "Robótica y Automatización",
    "Recursos Humanos",
    "Comercio Internacional y Aduanas",
]

SPECIALTY_KEYS = [
    "Dietetica",
    "Programacion",
    "Ciberseguridad",
    "Electricidad",
    "Robótica_y_Automatización",
    "Recursos_Humanos",
    "Comercio_Internacional_y_Aduanas",
]

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "change-this-in-production")
app.config["ENABLE_EMAILS"] = os.getenv("ENABLE_EMAILS", "false").strip().lower() == "true"
app.config["ADMIN_PASSWORD"] = os.getenv("ADMIN_PASSWORD", "admin123456")
app.config["EMAIL_USER"] = os.getenv("EMAIL_USER")
app.config["EMAIL_PASS"] = os.getenv("EMAIL_PASS")


def setup_logging() -> None:
    app.logger.setLevel(logging.INFO)

    log_path = BASE_DIR / "app.log"
    formatter = logging.Formatter(
        "%(asctime)s | %(levelname)s | %(message)s",
        "%Y-%m-%d %H:%M:%S",
    )

    if not app.logger.handlers:
        file_handler = RotatingFileHandler(log_path, maxBytes=1_000_000, backupCount=2, encoding="utf-8")
        file_handler.setFormatter(formatter)
        app.logger.addHandler(file_handler)

        stream_handler = logging.StreamHandler()
        stream_handler.setFormatter(formatter)
        app.logger.addHandler(stream_handler)


setup_logging()


def cargar_preguntas() -> dict[str, list[str]]:
    with PREGUNTAS_PATH.open("r", encoding="utf-8") as f:
        return json.load(f)


def cargar_registros() -> list[dict[str, Any]]:
    if not REGISTROS_PATH.exists():
        return []

    with REGISTROS_PATH.open("r", encoding="utf-8") as f:
        try:
            registros = json.load(f)
            return registros if isinstance(registros, list) else []
        except json.JSONDecodeError:
            app.logger.warning("registros.json corrupto, iniciando lista vacía")
            return []


def guardar_registro(data: dict[str, Any]) -> None:
    registros = cargar_registros()
    registros.append(data)

    with REGISTROS_PATH.open("w", encoding="utf-8") as f:
        json.dump(registros, f, indent=2, ensure_ascii=False)


def normalizar_texto(texto: str | None) -> str:
    if not texto:
        return ""
    return " ".join(texto.strip().split())


def validar_entrada(nombre: str, edad: str, correo: str, respuestas: dict[str, str], privacidad: str | None) -> list[str]:
    errores: list[str] = []

    if not nombre:
        errores.append("El nombre es obligatorio.")
    elif len(nombre) > MAX_NOMBRE_LENGTH:
        errores.append(f"El nombre no puede exceder {MAX_NOMBRE_LENGTH} caracteres.")

    if not edad.isdigit():
        errores.append("La edad debe ser un número válido.")
    else:
        edad_num = int(edad)
        if edad_num < MIN_EDAD or edad_num > MAX_EDAD:
            errores.append(f"La edad debe estar entre {MIN_EDAD} y {MAX_EDAD} años.")

    if not EMAIL_REGEX.match(correo):
        errores.append("El correo electrónico no tiene un formato válido.")

    for i in range(1, TOTAL_PREGUNTAS + 1):
        valor = respuestas.get(f"p{i}")
        if valor is None:
            errores.append(f"Falta responder la pregunta {i}.")
            continue
        if not valor.isdigit() or int(valor) < PUNTAJE_MIN or int(valor) > PUNTAJE_MAX:
            errores.append(f"La respuesta de la pregunta {i} no es válida.")

    if privacidad != "on":
        errores.append("Debes aceptar el aviso de privacidad para continuar.")

    return errores


def enviar_correo_alumno(nombre: str, correo: str, top3: list[tuple[str, int]], carrera_principal: str) -> bool:
    if not app.config["ENABLE_EMAILS"]:
        app.logger.info("Envío de email deshabilitado por configuración")
        return True

    email_user = app.config.get("EMAIL_USER")
    email_pass = app.config.get("EMAIL_PASS")
    if not email_user or not email_pass:
        app.logger.error("ENABLE_EMAILS=true pero faltan EMAIL_USER / EMAIL_PASS")
        return False

    try:
        asunto = f"Tus Resultados del Test Vocacional - {carrera_principal}"
        top3_html = "".join(
            f"<li><strong>{esp}</strong>: {puntos}/75 puntos</li>" for esp, puntos in top3
        )
        html_content = f"""
        <h2>Hola {nombre}</h2>
        <p>Gracias por completar el test vocacional de CBTis 106.</p>
        <p><strong>Especialidad principal recomendada:</strong> {carrera_principal}</p>
        <h3>Top 3 especialidades:</h3>
        <ol>{top3_html}</ol>
        <p>Este correo es informativo y no requiere respuesta.</p>
        """

        msg = MIMEMultipart("alternative")
        msg["Subject"] = asunto
        msg["From"] = email_user
        msg["To"] = correo
        msg.attach(MIMEText(html_content, "html"))

        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(email_user, email_pass)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as exc:
        app.logger.exception("No se pudo enviar el correo: %s", exc)
        return False


def calcular_puntajes(respuestas: dict[str, str]) -> dict[str, int]:
    puntajes: dict[str, int] = {}
    preguntas_por_area = 15

    for i, especialidad in enumerate(ESPECIALIDADES):
        inicio = i * preguntas_por_area + 1
        fin = inicio + preguntas_por_area

        total = 0
        for j in range(inicio, fin):
            total += int(respuestas[f"p{j}"])
        puntajes[especialidad] = total

    return puntajes


def extraer_respuestas_formulario() -> dict[str, str]:
    return {f"p{i}": request.form.get(f"p{i}", "") for i in range(1, TOTAL_PREGUNTAS + 1)}


def require_admin_password(view_func):
    @wraps(view_func)
    def wrapped(*args, **kwargs):
        supplied = request.args.get("pass", "")
        if supplied != app.config["ADMIN_PASSWORD"]:
            return render_template("error.html", code=403, message="Acceso denegado al panel administrativo."), 403
        return view_func(*args, **kwargs)

    return wrapped


def calcular_ranking(registros: list[dict[str, Any]]) -> list[tuple[str, int]]:
    contador: Counter[str] = Counter({esp: 0 for esp in ESPECIALIDADES})

    for registro in registros:
        respuestas = registro.get("respuestas", {})
        if not isinstance(respuestas, dict) or len(respuestas) != TOTAL_PREGUNTAS:
            continue

        try:
            puntajes = calcular_puntajes({k: str(v) for k, v in respuestas.items()})
        except Exception:
            continue

        principal = max(puntajes.items(), key=lambda x: x[1])[0]
        contador[principal] += 1

    return sorted(contador.items(), key=lambda x: x[1], reverse=True)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/health")
def health():
    return jsonify({"status": "ok", "timestamp": datetime.now(timezone.utc).isoformat()})


@app.route("/test")
def test():
    preguntas = cargar_preguntas()
    return render_template("test.html", preguntas=preguntas, errores=[], datos={})


@app.route("/procesar", methods=["POST"])
def procesar():
    nombre = normalizar_texto(request.form.get("nombre"))
    edad = normalizar_texto(request.form.get("edad"))
    correo = normalizar_texto(request.form.get("correo")).lower()
    privacidad = request.form.get("privacidad")

    respuestas = extraer_respuestas_formulario()
    errores = validar_entrada(nombre, edad, correo, respuestas, privacidad)

    if errores:
        preguntas = cargar_preguntas()
        datos = {"nombre": nombre, "edad": edad, "correo": correo}
        return (
            render_template("test.html", preguntas=preguntas, errores=errores, datos=datos),
            400,
        )

    puntajes = calcular_puntajes(respuestas)
    top3 = sorted(puntajes.items(), key=lambda x: x[1], reverse=True)[:3]
    carrera_principal = top3[0][0] if top3 else "Sin resultado"

    guardar_registro(
        {
            "nombre": nombre,
            "edad": int(edad),
            "correo": correo,
            "respuestas": respuestas,
            "top3": top3,
            "carrera_principal": carrera_principal,
            "fecha": datetime.now(timezone.utc).isoformat(),
        }
    )

    email_ok = enviar_correo_alumno(nombre, correo, top3, carrera_principal)
    if not email_ok:
        app.logger.warning("Resultado guardado, pero el correo no pudo enviarse")

    return render_template(
        "manual-resultado.html",
        nombre=nombre,
        edad=edad,
        correo=correo,
        respuestas=respuestas,
        puntajes=puntajes,
        top3=top3,
        carrera_principal=carrera_principal,
    )


@app.route("/dashboard")
@require_admin_password
def dashboard():
    registros = cargar_registros()
    ranking = calcular_ranking(registros)
    especialidad_mas_popular = ranking[0][0] if ranking else "Sin datos"

    return render_template(
        "dashboard.html",
        total_alumnos=len(registros),
        especialidad_mas_popular=especialidad_mas_popular,
        ranking=ranking,
    )


@app.route("/estadisticas")
@require_admin_password
def estadisticas():
    registros = cargar_registros()
    ranking = calcular_ranking(registros)

    return render_template(
        "estadisticas.html",
        total_alumnos=len(registros),
        ranking=ranking,
    )


@app.errorhandler(404)
def not_found(_):
    return render_template("error.html", code=404, message="La página solicitada no existe."), 404


@app.errorhandler(500)
def internal_error(_):
    return render_template("error.html", code=500, message="Ocurrió un error inesperado en el servidor."), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    app.logger.info("Servidor iniciado en http://127.0.0.1:%s", port)
    app.run(host="0.0.0.0", port=port, debug=False)

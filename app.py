import json
import os
import smtplib
from flask import Flask, render_template, request
from email.mime.text import MIMEText
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)

# =========================
# CONFIG
# =========================
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")

# =========================
# CARGAR PREGUNTAS
# =========================
def cargar_preguntas():
    with open("preguntas.json", "r", encoding="utf-8") as f:
        return json.load(f)

# =========================
# GUARDAR REGISTROS
# =========================
def guardar_registro(data):
    try:
        if not os.path.exists("registros.json"):
            with open("registros.json", "w", encoding="utf-8") as f:
                json.dump([], f)

        with open("registros.json", "r", encoding="utf-8") as f:
            try:
                registros = json.load(f)
            except:
                registros = []

        registros.append(data)

        with open("registros.json", "w", encoding="utf-8") as f:
            json.dump(registros, f, indent=4, ensure_ascii=False)

        print(f"Registro guardado: {data['nombre']} - {data['correo']}")

    except Exception as e:
        print(f"Error guardando registro: {e}")

# =========================
# ENVIAR CORREO
# =========================
def enviar_correo_alumno(nombre, correo, puntajes, top3, carrera_principal):
    try:
        asunto = f"Tus Resultados del Test Vocacional - {carrera_principal}"

        html_content = f"""
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resultados Test Vocacional</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); overflow: hidden;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 700;">🎓 Test Vocacional CBTis 106</h1>
            <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Tus resultados han llegado</p>
        </div>

        <!-- Contenido -->
        <div style="padding: 40px;">
            <!-- Saludo -->
            <p style="font-size: 16px; color: #333; margin: 0 0 30px 0;">¡Hola <strong>{nombre}</strong>! 👋</p>
            
            <!-- Carrera Principal -->
            <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
                <p style="margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">Tu Carrera Principal Recomendada</p>
                <h2 style="margin: 0; font-size: 32px; font-weight: 700;">{carrera_principal}</h2>
            </div>

            <!-- Top 3 -->
            <h3 style="font-size: 18px; color: #333; margin: 0 0 20px 0; font-weight: 700;">🏆 Tus Top 3 Especialidades</h3>
            <div style="margin-bottom: 30px;">
"""
        
        medals = ['🥇', '🥈', '🥉']
        colors = ['#fbbf24', '#d1d5db', '#f97316']
        
        for idx, (esp, puntos) in enumerate(top3):
            percentage = round((puntos / 75) * 100)
            color = colors[idx]
            medal = medals[idx]
            html_content += f"""
                <div style="background: #f8f9fa; border-left: 4px solid {color}; padding: 15px; margin-bottom: 12px; border-radius: 6px;">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <div style="flex: 1;">
                            <div style="font-size: 20px; font-weight: 700; color: #333; margin-bottom: 5px;">{medal} {esp}</div>
                            <div style="background: #e5e7eb; height: 6px; border-radius: 3px; overflow: hidden;">
                                <div style="background: linear-gradient(to right, #667eea, #764ba2); height: 100%; width: {percentage}%; border-radius: 3px;"></div>
                            </div>
                        </div>
                        <div style="text-align: right; margin-left: 15px;">
                            <div style="font-size: 18px; font-weight: 700; color: #667eea;">{puntos}/75</div>
                            <div style="font-size: 12px; color: #64748b;">{percentage}%</div>
                        </div>
                    </div>
                </div>
            """

        html_content += f"""
            </div>

            <!-- Mensaje motivador -->
            <div style="background: #ecfdf5; border: 1px solid #86efac; padding: 20px; border-radius: 8px; margin-bottom: 30px; color: #1b5e20;">
                <p style="margin: 0; font-size: 14px; line-height: 1.6;">
                    ¡Felicidades por completar el test vocacional! Los resultados muestran una clara afinidad por <strong>{carrera_principal}</strong>. 
                    Te recomendamos explorar todas las opciones y considerar tus intereses personales al tomar tu decisión final.
                </p>
            </div>

            <!-- Próximos pasos -->
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <h4 style="margin: 0 0 12px 0; color: #333; font-size: 14px; font-weight: 600;">📋 Próximos pasos:</h4>
                <ul style="margin: 0; padding-left: 20px; color: #64748b; font-size: 13px; line-height: 1.8;">
                    <li>Consulta con un orientador académico</li>
                    <li>Visita los talleres de especialidades</li>
                    <li>Habla con estudiantes de cada carrera</li>
                    <li>Toma tu decisión informado</li>
                </ul>
            </div>

            <!-- Footer -->
            <p style="text-align: center; color: #64748b; font-size: 12px; margin: 20px 0 0 0; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                Este es un correo automático. No responder a este mensaje en el email del CBTis 106.
            </p>
        </div>

        <!-- Advertencia de footer -->
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; font-size: 12px; color: #64748b;">
                CBTIS 106 - Centro de Bachillerato Tecnológico Industrial y de Servicios
            </p>
        </div>
    </div>
</body>
</html>
"""

        from email.mime.multipart import MIMEMultipart
        msg = MIMEMultipart('alternative')
        msg['Subject'] = asunto
        msg['From'] = EMAIL_USER
        msg['To'] = correo
        msg.attach(MIMEText(html_content, 'html'))

        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASS)
        server.send_message(msg)
        server.quit()

        print("Correo enviado correctamente")
        return True

    except Exception as e:
        print(f"Error enviando correo: {e}")
        return False

def calcular_puntajes(respuestas):
    especialidades = [
        "Dietética",
        "Programación",
        "Ciberseguridad",
        "Electricidad",
        "Robótica y Automatización",
        "Recursos Humanos",
        "Comercio Internacional y Aduanas"
    ]

    puntajes = {}
    preguntas_por_area = 15

    for i, esp in enumerate(especialidades):
        inicio = i * preguntas_por_area + 1
        fin = inicio + preguntas_por_area

        total = 0
        for j in range(inicio, fin):
            valor = respuestas.get(f"p{j}")
            if valor:
                total += int(valor)

        puntajes[esp] = total

    return puntajes

# =========================
# RUTAS
# =========================

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/test")
def test():
    preguntas = cargar_preguntas()
    return render_template("test.html", preguntas=preguntas)

@app.route("/procesar", methods=["POST"])
def procesar():
    nombre = request.form.get("nombre")
    correo = request.form.get("correo")

    respuestas = {}

    for i in range(1, 106):
        respuestas[f"p{i}"] = request.form.get(f"p{i}")

    # Guardar datos
    guardar_registro({
        "nombre": nombre,
        "correo": correo,
        "respuestas": respuestas
    })

    # Calcular puntajes PRIMERO
    puntajes = calcular_puntajes(respuestas)

    # ordenar de mayor a menor
    top3 = sorted(puntajes.items(), key=lambda x: x[1], reverse=True)[:3]

    carrera_principal = top3[0][0] if top3 else "Sin resultado"

    # Enviar correo CON los resultados
    enviar_correo_alumno(nombre, correo, puntajes, top3, carrera_principal)

    return render_template(
        "manual-resultado.html",
        nombre=nombre,
        correo=correo,
        respuestas=respuestas,
        puntajes=puntajes,
        top3=top3,
        carrera_principal=carrera_principal
    )

# =========================
# RUN
# =========================
if __name__ == "__main__":
    print("Servidor iniciado en http://127.0.0.1:5000")
    app.run(debug=False)
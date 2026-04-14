# Test Vocacional CBTis 106

Aplicación web profesional para orientar a estudiantes en la elección de especialidad técnica.

## Características

- Test vocacional de 105 preguntas.
- Validación robusta de nombre, edad, correo y respuestas.
- Aviso de privacidad obligatorio.
- Cálculo automático de puntajes y Top 3 especialidades.
- Panel administrativo con ranking y gráficas (`/dashboard`).
- Registro histórico de resultados en `registros.json`.
- Endpoint de salud (`/health`) para monitoreo.
- Logging estructurado en `app.log`.

## Requisitos

- Python 3.11+
- pip

## Instalación local

```bash
pip install -r requirements.txt
python app.py
```

Aplicación disponible en `http://127.0.0.1:5000`.

## Variables de entorno (`.env`)

```ini
PORT=5000
SECRET_KEY=tu-clave-segura
ADMIN_PASSWORD=cambia-esta-clave
ENABLE_EMAILS=false

# Solo si ENABLE_EMAILS=true
EMAIL_USER=tu-correo@gmail.com
EMAIL_PASS=tu-app-password
```

## Despliegue recomendado (Flask)

> Esta app **no es compatible con GitHub Pages** porque requiere backend en Python.

Plataformas recomendadas:

- Render
- Railway
- PythonAnywhere
- Fly.io

## Seguridad y operación

- Cambia `SECRET_KEY` y `ADMIN_PASSWORD` en producción.
- No subas `.env` al repositorio.
- Si no usarás correos, mantén `ENABLE_EMAILS=false`.
- Restringe el acceso al dashboard (`/dashboard?pass=...`).

## Rutas disponibles

- `GET /` Inicio.
- `GET /test` Formulario del test.
- `POST /procesar` Procesa y genera resultados.
- `GET /dashboard?pass=...` Panel administrativo.
- `GET /estadisticas?pass=...` Vista de estadísticas.
- `GET /health` Estado de servicio.

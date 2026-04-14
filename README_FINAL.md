# Test Vocacional CBTIS 106 - Versión Web Estática

## ✅ Estado actual

La app ahora funciona **sin Flask y sin `app.py`**. Todo corre en frontend:

- `index.html` (pantalla de inicio, test y resultados)
- `script.js` (lógica completa del test)
- `static/estilos.css` (diseño original)
- `preguntas.json` (banco de preguntas)

## 🚀 Cómo ejecutar (sin Flask)

Desde la carpeta del proyecto:

```bash
python3 -m http.server 5500
```

Luego abre:

- http://localhost:5500/

> Nota: No abras el HTML con `file://` porque `fetch('preguntas.json')` puede bloquearse por seguridad del navegador.

## 🧠 Qué conserva esta versión

- Diseño bonito original (gradientes, tarjetas, animaciones)
- 105 preguntas (7 especialidades)
- Barra de progreso en tiempo real
- Guardado automático en `localStorage`
- Resultado con Top 3 y puntajes por especialidad

## 💾 Persistencia de datos

Se guarda localmente en el navegador:

- `cbtis106_test_responses`
- `cbtis106_personal_data`
- `cbtis106_registros`

No se envían datos a servidor.

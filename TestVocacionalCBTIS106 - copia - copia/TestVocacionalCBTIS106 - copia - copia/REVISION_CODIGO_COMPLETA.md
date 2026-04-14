# Revisión completa del código

Fecha: 2026-04-08

## Alcance revisado

- Backend Flask (`app.py`)
- Plantillas HTML (`templates/*.html`)
- Activos estáticos y estructura general
- Dependencias y verificación (`requirements.txt`, `verify_app.py`)
- Consistencia documental (`README_FINAL.md`)

## Hallazgos principales

### 1) Inconsistencia funcional en resultados (corregido)

**Problema:** En `manual-resultado.html`, la sección "Top 3 Recomendaciones" iteraba como `for esp in top3` aunque `top3` es una lista de tuplas `(especialidad, puntaje)`. Eso rompía el cálculo visual de puntos y porcentajes.

**Estado:** ✅ Corregido. Ahora se itera como `for esp, puntos in top3`.

---

### 2) Dato de edad no propagado al resultado (corregido)

**Problema:** El formulario captura `edad`, pero en `/procesar` no se leía ni se enviaba a la plantilla de resultados. En la vista se mostraba `{{ edad }}` y quedaba vacío.

**Estado:** ✅ Corregido. Ahora `edad`:
- se obtiene del formulario,
- se guarda en `registros.json`,
- se pasa al render de `manual-resultado.html`.

---

### 3) Documentación desalineada con el código (pendiente)

**Problema:** `README_FINAL.md` describe dashboard, validaciones avanzadas y eliminación de correo, pero el `app.py` actual no implementa esas rutas/flujo y sí contiene envío de correo SMTP.

**Recomendación:** Actualizar README para reflejar el estado real del código o aplicar los cambios descritos en el documento.

---

### 4) Manejo de errores mejorable (pendiente)

**Problema:** Hay bloques `except:` genéricos en lectura de JSON y otros procesos.

**Riesgo:** Oculta causas reales y dificulta observabilidad.

**Recomendación:** Capturar excepciones específicas (`json.JSONDecodeError`, `OSError`, etc.) y registrar contexto.

---

### 5) Seguridad y privacidad (pendiente)

- Se almacena correo y respuestas completas en `registros.json` sin rotación ni cifrado.
- No hay validación robusta server-side de nombre/edad/correo (se confía principalmente en HTML).
- El envío SMTP no valida disponibilidad/configuración antes de intentar login.

**Recomendación mínima:**
- Validar entradas del lado servidor.
- Definir política de retención/anonimización para `registros.json`.
- Envolver envío de correo con una bandera de configuración (`EMAIL_ENABLED`).

## Riesgo general

**Medio.** El sistema funciona para flujo básico, pero hay deuda técnica/documental y de robustez de validación.

## Priorización sugerida

1. Actualizar README para evitar confusión operativa.
2. Fortalecer validaciones server-side.
3. Mejorar manejo de excepciones y logging estructurado.
4. Definir estrategia de persistencia segura de datos (idealmente base de datos).


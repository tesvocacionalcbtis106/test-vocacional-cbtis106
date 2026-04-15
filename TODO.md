# TODO: Limpieza de Emails
Estado: En progreso

## Pasos del plan aprobado:

### 1. [x] Editar index.html
- Remover campo correo del formulario ✅
- Actualizar display de resultados (studentMeta) ✅

### 2. [ ] Editar static/estilos.css
- Eliminar CSS de .email-notice y .email-icon

### 3. [x] Editar script.js
- Remover EMAILJS_CONFIG ✅
- Remover funciones: initEmailJS, emailJsConfigurado, mostrarAvisoCorreo, enviarCorreoAutomatico ✅
- Remover refs a emailNotice DOM ✅

### 4. [ ] Limpiar registros.json
- Remover campo "correo" de todas las entradas
- Remover entradas sin edad si corresponde

### 5. [ ] Verificar templates/*.html
- Buscar y remover referencias a email/correo

### 6. [ ] Test final
- Probar envío de formulario
- Verificar sin errores JS
- Confirmar display resultados OK

---

**Siguiente paso: Editar index.html**


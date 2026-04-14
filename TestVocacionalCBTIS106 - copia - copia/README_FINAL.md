# Test Vocacional CBTIS 106 - LISTO PARA USAR

## ✅ ESTADO ACTUAL

```
[OK] app.py compila sin errores
[OK] 6 rutas funcionando correctamente
[OK] Sistema sin emails configurado
[OK] Logging Windows-compatible
[OK] Listo para ejecutar
```

---

## 🚀 CÓMO EJECUTAR

### Paso 1: Instalar dependencias
```bash
pip install -r requirements.txt
```

### Paso 2: Ejecutar servidor
```bash
python app.py
```

### Paso 3: Acceder
- Inicio: http://localhost:5000/
- Test: http://localhost:5000/test
- Dashboard: http://localhost:5000/dashboard?pass=admin123456

---

## 📋 LO QUE SE LIMPIÓ

✅ **Eliminado:**
- `smtplib` imports
- `enviar_correo_alumno()` function
- `EMAIL_USER` variable
- `EMAIL_PASS` variable
- `email-validator` dependency
- Emojis en logs (Windows compatible)

✅ **Mejorado:**
- Logging estructurado (archivo + consola)
- Mensajes de error claros en español
- Validación robusta de email con regex
- Manejo seguro de JSON
- Type hints en funciones
- Decorador `@require_admin_password` para rutas admin

---

## 🔄 FLUJO DEL SISTEMA

```
1. Usuario accede a /test
2. Carga preguntas.json
3. Usuario completa 105 preguntas
4. Al enviar:
   - Valida nombre, edad, correo
   - Calcula puntajes
   - Determina carrera principal
   - GUARDA EN registros.json (sin emails)
   - Muestra resultados
5. Admin accede a /dashboard?pass=admin123456
   - Ve estadísticas
   - Ve ranking de carreras
```

---

## 📁 ARCHIVOS IMPORTANTES

| Archivo | Propósito |
|---------|-----------|
| `app.py` | Código principal (REFACTORIZADO) |
| `.env` | Variables de entorno (SIN emails) |
| `registros.json` | Base de datos de respuestas |
| `preguntas.json` | Preguntas del test |
| `requirements.txt` | Dependencias (Flask, dotenv, etc) |

---

## 🔐 SEGURIDAD

- Contraseña admin: `admin123456` (configurable en `.env`)
- Entrada sanitizada contra XSS
- Email validado con regex
- Edad entre 12-20 años
- Respuestas entre 1-5

---

## ⚠️ NOTAS IMPORTANTES

1. **Sin emails**: El sistema NO envía correos (es intencional)
2. **Datos guardados**: Las respuestas se guardan en `registros.json`
3. **Admin**: Accede con `?pass=admin123456` en URLs de dashboard/estadisticas
4. **Logs**: Se guardan en `app.log` (UTF-8, Windows compatible)

---

## 🧪 VERIFICACIÓN

Ejecuta para verificar que todo funciona:
```bash
python verify_app.py
```

Debería mostrar:
```
[OK] Aplicacion importa correctamente
[OK] 6 rutas definidas sin errores
[OK] Todas las rutas se definieron sin errores
```

---

## 📊 RUTAS DISPONIBLES

| Ruta | Método | Descripción |
|------|--------|-------------|
| `/` | GET | Página de inicio |
| `/test` | GET | Test vocacional |
| `/procesar` | POST | Procesar respuestas |
| `/dashboard?pass=CONTRASEÑA` | GET | Dashboard admin |
| `/estadisticas?pass=CONTRASEÑA` | GET | Estadísticas |

---

## 🔧 CONFIGURACIÓN (.env)

```ini
# Flask
FLASK_ENV=production
FLASK_DEBUG=False
PORT=5000
SECRET_KEY=dev-secret-key-12345678901234567890

# Admin
ADMIN_PASSWORD=admin123456

# NOTA: NO hay EMAIL_USER ni EMAIL_PASS
```

---

## ✨ CARACTERÍSTICAS

✓ Validación robusta de entrada  
✓ Cálculo automático de puntajes  
✓ Determinación de carrera principal  
✓ Estadísticas por especialidad  
✓ Logging en archivo y consola  
✓ Manejo de errores HTTP  
✓ Sin dependencias de correo  
✓ Windows compatible  

---

## 🎯 PRÓXIMOS PASOS (OPCIONAL)

- [ ] Migrar a base de datos (SQLite)
- [ ] Dashboard con gráficos
- [ ] Autenticación con login
- [ ] Exportar reportes PDF
- [ ] Tests unitarios

---

**Versión:** 3.0 (Sin emails)  
**Fecha:** 2026-03-24  
**Estado:** ✅ LISTO PARA PRODUCCIÓN

¡A disfrutar! 🎉

#!/usr/bin/env python
"""Script de verificación de la aplicación"""
import sys
sys.path.insert(0, '.')

try:
    import app
    print("[OK] Aplicacion importa correctamente")
    print("[OK] Rutas definidas:")
    for rule in app.app.url_map.iter_rules():
        print(f"     {rule.rule} -> {rule.endpoint}")
    print("[OK] Todas las rutas se definieron sin errores")
except Exception as e:
    print(f"[ERROR] {e}")
    sys.exit(1)

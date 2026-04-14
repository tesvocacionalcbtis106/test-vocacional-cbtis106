# -*- coding: utf-8 -*-
"""
Utilities para el Test Vocacional CBTis 106
Este archivo contiene funciones de utilidad para el proyecto.
"""

import os
import json
from datetime import datetime


def cargar_registros():
    """Carga los registros desde el archivo JSON"""
    try:
        if os.path.exists('registros.json'):
            with open('registros.json', 'r', encoding='utf-8') as f:
                return json.load(f)
        return []
    except Exception as e:
        print(f"Error cargando registros: {e}")
        return []


def obtener_estadisticas():
    """Obtiene estadísticas de los registros"""
    registros = cargar_registros()
    
    if not registros:
        return {
            'total': 0,
            'por_carrera': {},
            'promedio_edad': 0
        }
    
    # Contar carreras
    por_carrera = {}
    for reg in registros:
        carrera = reg.get('carrera_principal', 'Unknown')
        por_carrera[carrera] = por_carrera.get(carrera, 0) + 1
    
    # Calcular promedio de edad
    edades = [reg.get('edad', 0) for reg in registros if reg.get('edad', 0) > 0]
    promedio_edad = sum(edades) / len(edades) if edades else 0
    
    return {
        'total': len(registros),
        'por_carrera': por_carrera,
        'promedio_edad': round(promedio_edad, 1)
    }


def limpiar_registros():
    """Limpia todos los registros (función de administración)"""
    try:
        if os.path.exists('registros.json'):
            os.remove('registros.json')
            return True
        return False
    except Exception as e:
        print(f"Error limpiando registros: {e}")
        return False


def verificar_configuracion():
    """Verifica la configuración del sistema"""
    from dotenv import load_dotenv
    
    load_dotenv()
    
    config = {
        'EMAIL_USER': os.getenv('EMAIL_USER', ''),
        'EMAIL_PASS': ' configurado' if os.getenv('EMAIL_PASS') else 'NO configurado',
        'EMAIL_ADMIN': os.getenv('EMAIL_ADMIN', ''),
        'SECRET_KEY': ' configurado' if os.getenv('SECRET_KEY') else 'NO configurado'
    }
    
    return config


if __name__ == '__main__':
    print("=== Utilidades Test Vocacional CBTis 106 ===")
    print("\nEstadísticas:")
    stats = obtener_estadisticas()
    print(f"  Total de registros: {stats['total']}")
    print(f"  Promedio de edad: {stats['promedio_edad']} años")
    print("  Distribución por carrera:")
    for carrera, count in stats['por_carrera'].items():
        print(f"    - {carrera}: {count}")
    
    print("\nConfiguración:")
    config = verificar_configuracion()
    for key, value in config.items():
        print(f"  {key}: {value}")


@echo off
REM SCRIPT MAESTRO FINAL - TODO: Tablas + Datos de Ejemplo

cls
echo.
echo ════════════════════════════════════════════════════════════════════════════
echo.
echo     🎉 CREAR BASE DE DATOS + DATOS DE EJEMPLO PARA PRUEBAS
echo.
echo ════════════════════════════════════════════════════════════════════════════
echo.

echo 📋 Paso 1: Creando tablas en Supabase...
call node CREATE-EXAMPLE-DATA.js

if errorlevel 0 (
    echo.
    echo ✅ ¡ÉXITO! Base de datos creada con datos de ejemplo
    echo.
    echo 🎯 PRÓXIMO PASO:
    echo.
    echo    npm run dev
    echo.
    echo    Luego abre: http://localhost:3000
    echo.
    echo ════════════════════════════════════════════════════════════════════════════
    echo.
) else (
    echo.
    echo ⚠️  Intentando con Python...
    python CREATE-EXAMPLE-DATA.py
)

pause

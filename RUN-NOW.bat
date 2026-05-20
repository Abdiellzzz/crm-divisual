@echo off
REM SCRIPT MAESTRO - Hace TODO automáticamente
REM Windows 10+

cls
echo.
echo ════════════════════════════════════════════════════════════════════════
echo.
echo         🚀 INSTALACIÓN AUTOMÁTICA COMPLETA - CRM APEX
echo.
echo ════════════════════════════════════════════════════════════════════════
echo.

echo 📋 Paso 1: Verificando Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Python no encontrado, intentando con Node.js...
    goto nodejs
)

echo ✅ Python encontrado
echo.
echo 📋 Paso 2: Ejecutando setup automático...
python RUN-NOW.py
if errorlevel 0 (
    goto success
) else (
    goto nodejs
)

:nodejs
echo.
echo 📋 Intentando con Node.js...
node auto-setup.js
if errorlevel 0 (
    goto success
) else (
    goto error
)

:success
echo.
echo ════════════════════════════════════════════════════════════════════════
echo.
echo ✨ ¡BASE DE DATOS CONFIGURADA EXITOSAMENTE!
echo.
echo 📊 PRÓXIMO PASO:
echo.
echo    npm run dev
echo.
echo    Tu CRM estará en: http://localhost:3000
echo.
echo ════════════════════════════════════════════════════════════════════════
echo.
pause
goto end

:error
echo.
echo ❌ Error durante la configuración
echo.
pause
goto end

:end

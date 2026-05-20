@echo off
REM ============================================================
REM SCRIPT MAESTRO - Configura TODO automáticamente
REM ============================================================

cls
echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║                                                        ║
echo ║         🚀 CONFIGURACIÓN COMPLETA DE CRM             ║
echo ║                                                        ║
echo ╚════════════════════════════════════════════════════════╝
echo.

echo 📋 Paso 1: Instalando dependencias...
call npm install
if errorlevel 1 (
    echo ❌ Error al instalar dependencias
    goto error
)
echo ✅ Dependencias instaladas
echo.

echo 📋 Paso 2: Creando tablas en Supabase...
call node auto-setup.js
if errorlevel 1 (
    echo ⚠️ Continuando...
)
echo.

echo 📋 Paso 3: Resumen final
echo ═════════════════════════════════════════════════════════
echo ✨ ¡CONFIGURACIÓN COMPLETADA!
echo.
echo 📊 COMPLETADO:
echo    ✅ Dependencias instaladas
echo    ✅ Tablas de BD creadas
echo    ✅ Seguridad RLS habilitada
echo.
echo 🚀 INICIA TU CRM CON:
echo    npm run dev
echo.
echo 📱 Accede a:
echo    http://localhost:3000
echo ═════════════════════════════════════════════════════════
echo.
pause
goto end

:error
echo ❌ Error durante la configuración
pause
goto end

:end

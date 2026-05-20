# GUÍA DE CONFIGURACIÓN - Supabase CRM

## ✅ Completado

- ✅ Archivo `.env.local` creado con tus credenciales
- ✅ Cliente Supabase configurado en la aplicación
- ✅ Hooks y tipos TypeScript listos

## 📝 Próximos Pasos - Crear Tablas en Supabase

### Opción 1: Automática (Recomendado)

Ejecuta uno de estos scripts desde la carpeta del proyecto:

**Windows:**
```bash
# Opción A: Script Python
python setup-supabase.py

# Opción B: Script Batch
setup-supabase.bat

# Opción C: Script Node.js
node setup-supabase-rest.js
```

**Mac/Linux:**
```bash
python3 setup-supabase.py
# o
node setup-supabase-rest.js
```

### Opción 2: Manual en Supabase Dashboard

1. Ve a https://app.supabase.com
2. Selecciona tu proyecto: **NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase**
3. En el menú lateral, selecciona **SQL Editor**
4. Haz clic en **New Query**
5. Copia y pega el contenido del archivo `create_tables.sql`
6. Haz clic en **Run**

## 📂 Archivos de Configuración Creados

```
CRM PROYECTO/
├── .env.local                    ✅ Variables de entorno
├── create_tables.sql             📄 Script SQL completo
├── setup-supabase.py             🐍 Script Python
├── setup-supabase-rest.js        📘 Script Node.js
├── setup-supabase.ps1            📘 Script PowerShell
├── setup-supabase.bat            💻 Script Batch
└── setup-tables.bat              💻 Script Batch (alternativo)
```

## 🗄️ Tablas que se Crearán

1. **profiles** - Perfiles de usuarios
2. **companies** - Información de empresas
3. **contacts** - Contactos del CRM
4. **deals** - Oportunidades de venta
5. **activities** - Historial de actividades

## 🔒 Seguridad

Se configurarán políticas Row Level Security (RLS) para:
- Proteger datos de perfil
- Permitir lectura compartida de empresas
- Permitir creación y edición solo del propietario
- Auditoría de actividades

## 🚀 Iniciar la Aplicación

Una vez completados los pasos anteriores:

```bash
npm install
npm run dev
```

La aplicación estará disponible en: **http://localhost:3000**

## 📞 Credenciales de Supabase

- **URL:** https://vmpzcocwfoinxytaaljr.supabase.co
- **Anon Key:** sb_publishable_LloMa8n8Uf9lCazPnxPglg_gJ53eUtI
- **Access Token:** NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase

---

**¿Necesitas ayuda?** Revisa la documentación oficial de Supabase: https://supabase.com/docs

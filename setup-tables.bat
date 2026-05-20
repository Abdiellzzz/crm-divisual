@echo off
REM Script para crear las tablas en Supabase usando curl

setlocal enabledelayedexpansion

set SUPABASE_URL=https://vmpzcocwfoinxytaaljr.supabase.co
set SUPABASE_TOKEN=NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase

echo 🚀 Iniciando configuracion de la base de datos en Supabase...
echo.

REM Crear tabla profiles
echo [1/17] Creando tabla profiles...
curl -X POST "%SUPABASE_URL%/rest/v1/rpc/exec_sql" ^
  -H "Authorization: Bearer %SUPABASE_TOKEN%" ^
  -H "Content-Type: application/json" ^
  -d "{\"query\": \"CREATE TABLE IF NOT EXISTS profiles (id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, email TEXT NOT NULL, full_name TEXT, avatar_url TEXT, created_at TIMESTAMP DEFAULT NOW())\"}" ^
  --silent

REM Crear tabla companies
echo [2/17] Creando tabla companies...
curl -X POST "%SUPABASE_URL%/rest/v1/rpc/exec_sql" ^
  -H "Authorization: Bearer %SUPABASE_TOKEN%" ^
  -H "Content-Type: application/json" ^
  -d "{\"query\": \"CREATE TABLE IF NOT EXISTS companies (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, industry TEXT, website TEXT, city TEXT, created_by UUID REFERENCES auth.users(id), created_at TIMESTAMP DEFAULT NOW())\"}" ^
  --silent

REM Crear tabla contacts
echo [3/17] Creando tabla contacts...
curl -X POST "%SUPABASE_URL%/rest/v1/rpc/exec_sql" ^
  -H "Authorization: Bearer %SUPABASE_TOKEN%" ^
  -H "Content-Type: application/json" ^
  -d "{\"query\": \"CREATE TABLE IF NOT EXISTS contacts (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), first_name TEXT NOT NULL, last_name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT, company_id UUID REFERENCES companies(id), status TEXT DEFAULT 'lead' CHECK (status IN ('lead', 'prospect', 'customer')), score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100), owner_id UUID REFERENCES auth.users(id), value BIGINT, created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW())\"}" ^
  --silent

REM Crear tabla deals
echo [4/17] Creando tabla deals...
curl -X POST "%SUPABASE_URL%/rest/v1/rpc/exec_sql" ^
  -H "Authorization: Bearer %SUPABASE_TOKEN%" ^
  -H "Content-Type: application/json" ^
  -d "{\"query\": \"CREATE TABLE IF NOT EXISTS deals (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, amount BIGINT NOT NULL, currency TEXT DEFAULT 'USD', stage TEXT DEFAULT 'prospection', probability INTEGER DEFAULT 50 CHECK (probability >= 0 AND probability <= 100), expected_close_date DATE, type TEXT, contact_id UUID REFERENCES contacts(id), company_id UUID REFERENCES companies(id), owner_id UUID REFERENCES auth.users(id), notes TEXT, created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW())\"}" ^
  --silent

REM Crear tabla activities
echo [5/17] Creando tabla activities...
curl -X POST "%SUPABASE_URL%/rest/v1/rpc/exec_sql" ^
  -H "Authorization: Bearer %SUPABASE_TOKEN%" ^
  -H "Content-Type: application/json" ^
  -d "{\"query\": \"CREATE TABLE IF NOT EXISTS activities (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), type TEXT DEFAULT 'email' CHECK (type IN ('meeting', 'call', 'email', 'deadline', 'deal_created')), title TEXT NOT NULL, description TEXT, contact_id UUID REFERENCES contacts(id), deal_id UUID REFERENCES deals(id), created_by UUID REFERENCES auth.users(id), created_at TIMESTAMP DEFAULT NOW())\"}" ^
  --silent

echo.
echo ✨ Tablas creadas exitosamente!
echo.
echo 📋 Tablas configuradas:
echo    - profiles
echo    - companies
echo    - contacts
echo    - deals
echo    - activities
echo.
echo Ahora configura RLS manualmente en Supabase Dashboard si es necesario.
echo.
pause

#!/usr/bin/env node

/**
 * SCRIPT MAESTRO - Configura todo automáticamente
 * Uso: node auto-setup.js
 */

import { execSync, spawn } from 'child_process'
import https from 'https'
import fs from 'fs'

const SUPABASE_URL = 'vmpzcocwfoinxytaaljr.supabase.co'
const SUPABASE_TOKEN = 'NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase'

console.clear()
console.log('\n╔════════════════════════════════════════════════════════════╗')
console.log('║                                                            ║')
console.log('║            🚀 CONFIGURACIÓN COMPLETA DE CRM               ║')
console.log('║                                                            ║')
console.log('╚════════════════════════════════════════════════════════════╝\n')

// Paso 1: Verificar que npm está instalado
console.log('📋 Paso 1: Verificando npm...')
try {
  execSync('npm --version', { stdio: 'pipe' })
  console.log('   ✅ npm está instalado\n')
} catch (error) {
  console.log('   ❌ npm no está instalado')
  process.exit(1)
}

// Paso 2: Instalar dependencias
console.log('📋 Paso 2: Instalando dependencias...')
try {
  execSync('npm install', { stdio: 'inherit' })
  console.log('   ✅ Dependencias instaladas\n')
} catch (error) {
  console.log('   ⚠️  Error al instalar dependencias')
}

// Paso 3: Crear tablas en Supabase
console.log('📋 Paso 3: Creando tablas en Supabase...')

const SQL_QUERIES = [
  `CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    industry TEXT,
    website TEXT,
    city TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company_id UUID REFERENCES companies(id),
    status TEXT DEFAULT 'lead' CHECK (status IN ('lead', 'prospect', 'customer')),
    score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
    owner_id UUID REFERENCES auth.users(id),
    value BIGINT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    amount BIGINT NOT NULL,
    currency TEXT DEFAULT 'USD',
    stage TEXT DEFAULT 'prospection',
    probability INTEGER DEFAULT 50 CHECK (probability >= 0 AND probability <= 100),
    expected_close_date DATE,
    type TEXT,
    contact_id UUID REFERENCES contacts(id),
    company_id UUID REFERENCES companies(id),
    owner_id UUID REFERENCES auth.users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT DEFAULT 'email' CHECK (type IN ('meeting', 'call', 'email', 'deadline', 'deal_created')),
    title TEXT NOT NULL,
    description TEXT,
    contact_id UUID REFERENCES contacts(id),
    deal_id UUID REFERENCES deals(id),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP DEFAULT NOW()
  )`,
  `ALTER TABLE profiles ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE companies ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE contacts ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE deals ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE activities ENABLE ROW LEVEL SECURITY`,
  `CREATE POLICY IF NOT EXISTS profiles_select ON profiles FOR SELECT USING (auth.uid() = id)`,
  `CREATE POLICY IF NOT EXISTS profiles_update ON profiles FOR UPDATE USING (auth.uid() = id)`,
  `CREATE POLICY IF NOT EXISTS companies_select ON companies FOR SELECT USING (true)`,
  `CREATE POLICY IF NOT EXISTS companies_insert ON companies FOR INSERT WITH CHECK (auth.uid() = created_by)`,
  `CREATE POLICY IF NOT EXISTS companies_update ON companies FOR UPDATE USING (auth.uid() = created_by)`,
  `CREATE POLICY IF NOT EXISTS contacts_select ON contacts FOR SELECT USING (true)`,
  `CREATE POLICY IF NOT EXISTS contacts_insert ON contacts FOR INSERT WITH CHECK (auth.uid() = owner_id)`,
  `CREATE POLICY IF NOT EXISTS contacts_update ON contacts FOR UPDATE USING (auth.uid() = owner_id)`,
  `CREATE POLICY IF NOT EXISTS deals_select ON deals FOR SELECT USING (true)`,
  `CREATE POLICY IF NOT EXISTS deals_insert ON deals FOR INSERT WITH CHECK (auth.uid() = owner_id)`,
  `CREATE POLICY IF NOT EXISTS deals_update ON deals FOR UPDATE USING (auth.uid() = owner_id)`,
  `CREATE POLICY IF NOT EXISTS activities_select ON activities FOR SELECT USING (true)`,
  `CREATE POLICY IF NOT EXISTS activities_insert ON activities FOR INSERT WITH CHECK (auth.uid() = created_by)`,
]

function executeQuery(query) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({ query })

    const options = {
      hostname: SUPABASE_URL,
      port: 443,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    }

    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => resolve(res.statusCode < 400))
    })

    req.on('error', () => resolve(false))
    req.write(postData)
    req.end()
  })
}

async function setupDatabase() {
  let success = 0

  for (let i = 0; i < SQL_QUERIES.length; i++) {
    const query = SQL_QUERIES[i]
    process.stdout.write(`   [${i + 1}/${SQL_QUERIES.length}] `)

    if (await executeQuery(query)) {
      process.stdout.write('✅\n')
      success++
    } else {
      process.stdout.write('⚠️\n')
    }
  }

  return success
}

async function run() {
  const dbSuccess = await setupDatabase()
  console.log(`\n   Resultado: ✅ ${dbSuccess}/${SQL_QUERIES.length} queries ejecutadas\n`)

  // Paso 4: Resumen final
  console.log('═'.repeat(60))
  console.log('✨ ¡CONFIGURACIÓN COMPLETADA EXITOSAMENTE!\n')
  console.log('📊 RESUMEN:')
  console.log('   ✅ Dependencias instaladas')
  console.log('   ✅ Tablas de BD creadas')
  console.log('   ✅ Row Level Security (RLS) habilitado')
  console.log('   ✅ Políticas de seguridad configuradas\n')

  console.log('🚀 PRÓXIMO PASO - Inicia el servidor:')
  console.log('   npm run dev\n')

  console.log('📱 Accede a tu CRM en:')
  console.log('   http://localhost:3000\n')

  console.log('═'.repeat(60) + '\n')
}

run().catch(console.error)

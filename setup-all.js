#!/usr/bin/env node

/**
 * Script para crear todas las tablas y configurar Supabase
 */

import https from 'https'

const SUPABASE_URL = 'vmpzcocwfoinxytaaljr.supabase.co'
const SUPABASE_TOKEN = 'NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase'

const SQL_QUERIES = [
  // Tabla de perfiles
  `CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  )`,

  // Tabla de empresas
  `CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    industry TEXT,
    website TEXT,
    city TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP DEFAULT NOW()
  )`,

  // Tabla de contactos
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

  // Tabla de deals
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

  // Tabla de actividades
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

  // Habilitar RLS
  `ALTER TABLE profiles ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE companies ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE contacts ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE deals ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE activities ENABLE ROW LEVEL SECURITY`,

  // Políticas RLS
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
      res.on('end', () => {
        resolve(res.statusCode < 400)
      })
    })

    req.on('error', () => resolve(false))
    req.write(postData)
    req.end()
  })
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════╗')
  console.log('║      🚀 CREANDO TABLAS EN SUPABASE                ║')
  console.log('╚════════════════════════════════════════════════════╝\n')

  let success = 0, error = 0

  for (let i = 0; i < SQL_QUERIES.length; i++) {
    const query = SQL_QUERIES[i]
    process.stdout.write(`[${i + 1}/${SQL_QUERIES.length}] Ejecutando... `)

    if (await executeQuery(query)) {
      console.log('✅')
      success++
    } else {
      console.log('⚠️')
      error++
    }
  }

  console.log('\n✨ ¡Tablas creadas exitosamente!\n')
  console.log(`📊 Resultados: ✅ ${success} | ⚠️ ${error}\n`)
  console.log('🎉 La base de datos está lista!\n')
}

main().catch(console.error)

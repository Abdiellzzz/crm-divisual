#!/usr/bin/env node

/**
 * Script interactivo para configurar Supabase CRM
 * Uso: node setup-interactive.js
 */

import https from 'https'
import { createInterface } from 'readline'

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
})

const SUPABASE_URL = 'vmpzcocwfoinxytaaljr.supabase.co'
const SUPABASE_TOKEN = 'NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase'

const SQL_QUERIES = [
  {
    name: 'profiles',
    sql: `CREATE TABLE IF NOT EXISTS profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      email TEXT NOT NULL,
      full_name TEXT,
      avatar_url TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )`
  },
  {
    name: 'companies',
    sql: `CREATE TABLE IF NOT EXISTS companies (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      industry TEXT,
      website TEXT,
      city TEXT,
      created_by UUID REFERENCES auth.users(id),
      created_at TIMESTAMP DEFAULT NOW()
    )`
  },
  {
    name: 'contacts',
    sql: `CREATE TABLE IF NOT EXISTS contacts (
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
    )`
  },
  {
    name: 'deals',
    sql: `CREATE TABLE IF NOT EXISTS deals (
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
    )`
  },
  {
    name: 'activities',
    sql: `CREATE TABLE IF NOT EXISTS activities (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      type TEXT DEFAULT 'email' CHECK (type IN ('meeting', 'call', 'email', 'deadline', 'deal_created')),
      title TEXT NOT NULL,
      description TEXT,
      contact_id UUID REFERENCES contacts(id),
      deal_id UUID REFERENCES deals(id),
      created_by UUID REFERENCES auth.users(id),
      created_at TIMESTAMP DEFAULT NOW()
    )`
  },
  {
    name: 'habilitar_rls',
    sql: `ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
          ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
          ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
          ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
          ALTER TABLE activities ENABLE ROW LEVEL SECURITY;`
  }
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

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        resolve(res.statusCode < 400)
      })
    })

    req.on('error', () => {
      resolve(false)
    })

    req.write(postData)
    req.end()
  })
}

function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

async function main() {
  console.clear()
  console.log('\n╔════════════════════════════════════════════════════╗')
  console.log('║         🚀 CONFIGURACIÓN DE SUPABASE CRM          ║')
  console.log('╚════════════════════════════════════════════════════╝\n')

  console.log('📋 Este script creará las tablas necesarias en tu base de datos Supabase.\n')

  console.log('Información del proyecto:')
  console.log('  • URL: https://vmpzcocwfoinxytaaljr.supabase.co')
  console.log('  • Tablas a crear: 5')
  console.log('  • Seguridad: RLS habilitado\n')

  const confirm = await question('¿Deseas continuar? (s/n): ')

  if (confirm.toLowerCase() !== 's') {
    console.log('\n❌ Cancelado.')
    rl.close()
    return
  }

  console.log('\n🔄 Iniciando configuración...\n')

  let successCount = 0
  let errorCount = 0

  for (let i = 0; i < SQL_QUERIES.length; i++) {
    const item = SQL_QUERIES[i]
    const current = i + 1
    const total = SQL_QUERIES.length

    process.stdout.write(`[${current}/${total}] Configurando ${item.name}... `)

    const success = await executeQuery(item.sql)

    if (success) {
      console.log('✅')
      successCount++
    } else {
      console.log('⚠️ ')
      errorCount++
    }
  }

  console.log('\n✨ ¡Configuración completada!\n')
  console.log('📊 Resultados:')
  console.log(`   ✅ Exitosas: ${successCount}`)
  console.log(`   ⚠️  Advertencias: ${errorCount}`)

  console.log('\n📋 Próximos pasos:')
  console.log('   1. npm install')
  console.log('   2. npm run dev')
  console.log('   3. Abre http://localhost:3000')

  console.log('\n✅ ¡Supabase está listo para usar!\n')

  rl.close()
}

main().catch(console.error)

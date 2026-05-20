#!/usr/bin/env node

/**
 * Script de verificación - Comprueba que todo está configurado
 */

import fs from 'fs'
import path from 'path'

console.clear()
console.log('\n╔═══════════════════════════════════════════════════════════╗')
console.log('║         ✅ VERIFICACIÓN DE CONFIGURACIÓN                 ║')
console.log('╚═══════════════════════════════════════════════════════════╝\n')

const checks = [
  {
    name: 'Archivo .env.local',
    file: '.env.local',
    required: true,
  },
  {
    name: 'Variables en .env.local',
    check: () => {
      const content = fs.readFileSync('.env.local', 'utf8')
      return content.includes('NEXT_PUBLIC_SUPABASE_URL') &&
             content.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY') &&
             content.includes('SUPABASE_ACCESS_TOKEN')
    }
  },
  {
    name: 'Cliente Supabase (src/lib/supabase.ts)',
    file: 'src/lib/supabase.ts',
  },
  {
    name: 'Tipos TypeScript (src/lib/types.ts)',
    file: 'src/lib/types.ts',
  },
  {
    name: 'Hook useAuth (src/hooks/useAuth.ts)',
    file: 'src/hooks/useAuth.ts',
  },
  {
    name: 'Hook useContacts (src/hooks/useContacts.ts)',
    file: 'src/hooks/useContacts.ts',
  },
  {
    name: 'Hook useDeals (src/hooks/useDeals.ts)',
    file: 'src/hooks/useDeals.ts',
  },
  {
    name: 'package.json actualizado',
    check: () => {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
      return pkg.scripts && pkg.scripts.setup !== undefined
    }
  },
  {
    name: 'Script auto-setup.js',
    file: 'auto-setup.js',
  },
  {
    name: 'Script INSTALAR-TODO.bat',
    file: 'INSTALAR-TODO.bat',
  },
  {
    name: 'node_modules/',
    file: 'node_modules',
    optional: true,
  },
]

let passed = 0
let failed = 0
let optional_failed = 0

for (const check of checks) {
  let result = false
  let reason = ''

  if (check.check) {
    try {
      result = check.check()
    } catch (e) {
      reason = e.message
    }
  } else if (check.file) {
    result = fs.existsSync(check.file)
    if (!result) {
      reason = `Archivo no encontrado: ${check.file}`
    }
  }

  const icon = result ? '✅' : '❌'
  const status = check.optional && !result ? '⚠️' : icon

  console.log(`${status} ${check.name}`)
  if (reason && !result) {
    console.log(`   ${reason}`)
  }

  if (result) {
    passed++
  } else if (check.optional) {
    optional_failed++
  } else {
    failed++
  }
}

console.log('\n' + '═'.repeat(61))
console.log(`\n📊 RESULTADOS:\n`)
console.log(`   ✅ Pasadas: ${passed}`)
if (failed > 0) {
  console.log(`   ❌ Fallidas: ${failed}`)
}
if (optional_failed > 0) {
  console.log(`   ⚠️  Opcionales no encontradas: ${optional_failed}`)
}

if (failed === 0) {
  console.log('\n✨ ¡TODO ESTÁ CONFIGURADO CORRECTAMENTE!\n')
  console.log('🚀 Próximos pasos:\n')
  console.log('   1. npm install  (si aún no lo hiciste)')
  console.log('   2. node auto-setup.js  (o INSTALAR-TODO.bat)')
  console.log('   3. npm run dev')
  console.log('   4. Abre: http://localhost:3000\n')
} else {
  console.log('\n❌ Hay configuraciones faltantes.\n')
  console.log('Por favor, completa los pasos en 00-EMPEZAR-AQUI.md\n')
}

console.log('═'.repeat(61) + '\n')

process.exit(failed > 0 ? 1 : 0)

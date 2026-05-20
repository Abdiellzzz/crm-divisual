'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const { signup, loading, error } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await signup(email, password, fullName)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-apex-bg">
      <div className="w-full max-w-md">
        <div className="bg-apex-s1 border border-apex-bdr rounded-2xl p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-apex-gold mb-2">APEX CRM</h1>
            <p className="text-apex-txt2">Crea tu cuenta</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-apex-txt2 mb-2">Nombre Completo</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-apex-s2 border border-apex-bdr rounded-lg px-4 py-2 text-apex-txt focus:outline-none focus:border-apex-gold2"
                placeholder="Tu Nombre"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-apex-txt2 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-apex-s2 border border-apex-bdr rounded-lg px-4 py-2 text-apex-txt focus:outline-none focus:border-apex-gold2"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-apex-txt2 mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-apex-s2 border border-apex-bdr rounded-lg px-4 py-2 text-apex-txt focus:outline-none focus:border-apex-gold2"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-apex-gold hover:bg-apex-gold2 disabled:opacity-50 text-black font-semibold rounded-lg py-2 transition-colors"
            >
              {loading ? 'Cargando...' : 'Registrarse'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-apex-txt2">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-apex-gold hover:text-apex-gold2">
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-apex-txt3">
          Demo CRM | Todos los campos son requeridos
        </p>
      </div>
    </div>
  )
}

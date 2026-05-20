'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'

const navItems = [
  { href: '/', label: 'Dashboard', icon: 'ti-layout-dashboard' },
  { href: '/contacts', label: 'Contactos', icon: 'ti-users' },
  { href: '/pipeline', label: 'Pipeline', icon: 'ti-layout-kanban' },
]

export function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const getInitials = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
    }
    return user?.email?.slice(0, 2).toUpperCase() || 'CA'
  }

  return (
    <nav className="h-14 bg-apex-s1 border-b border-apex-bdr flex items-center px-5 gap-0">
      <div className="flex items-center gap-8 flex-1">
        <div className="font-bold text-sm tracking-wide">
          <span className="text-apex-gold">APEX</span>
          <span className="text-apex-txt2 font-normal ml-1">CRM</span>
        </div>

        <div className="flex gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                pathname === item.href
                  ? 'bg-gold-light text-apex-gold border border-apex-bdr2'
                  : 'text-apex-txt2 hover:bg-apex-s2 hover:text-apex-txt'
              }`}
            >
              <i className={`ti ${item.icon} mr-1`}></i>
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="w-8 h-8 rounded-md bg-apex-s2 border border-apex-bdr flex items-center justify-center hover:border-apex-bdr2 transition-colors cursor-pointer">
          <i className="ti ti-bell text-apex-txt2 text-sm"></i>
        </button>
        <div className="w-8 h-8 rounded-full bg-apex-gold flex items-center justify-center text-black text-xs font-bold cursor-pointer">
          {getInitials()}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="text-xs"
        >
          Salir
        </Button>
      </div>
    </nav>
  )
}

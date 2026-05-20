'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { useContacts } from '@/hooks/useContacts'

export default function ContactsPage() {
  const { contacts } = useContacts()
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase())

    if (filter === 'all') return matchesSearch
    return matchesSearch && contact.status === filter
  })

  const getInitials = (firstName: string, lastName: string) => {
    return (firstName[0] + lastName[0]).toUpperCase()
  }

  const avatarColors = ['bg-green-900', 'bg-red-900', 'bg-yellow-900', 'bg-blue-900', 'bg-cyan-900', 'bg-pink-900']
  const getAvatarColor = (index: number) => avatarColors[index % avatarColors.length]

  const statusColorMap = {
    lead: 'text-purple-400',
    prospect: 'text-yellow-400',
    customer: 'text-green-400',
  }

  return (
    <div className="pb-10">
      <PageHeader
        title="Contactos"
        subtitle="847 contactos · 142 leads activos"
        actions={
          <>
            <Button variant="outline">
              <i className="ti ti-upload"></i> Importar
            </Button>
            <Button>+ Nuevo Contacto</Button>
          </>
        }
      />

      {/* Search and Filter */}
      <div className="px-5 mb-4 flex gap-3">
        <div className="flex-1 relative">
          <i className="ti ti-search absolute left-3 top-1/2 transform -translate-y-1/2 text-apex-txt3 text-sm"></i>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, empresa, email…"
            className="w-full bg-apex-s1 border border-apex-bdr rounded-lg pl-9 pr-4 py-2 text-apex-txt text-sm focus:outline-none focus:border-apex-bdr2"
          />
        </div>

        <div className="flex gap-2">
          {['all', 'lead', 'prospect', 'customer'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filter === status
                  ? 'bg-gold-light text-apex-gold border border-apex-bdr2'
                  : 'bg-transparent border border-apex-bdr text-apex-txt2 hover:border-apex-gold2'
              }`}
            >
              {status === 'all' ? 'Todos' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card className="px-0" noPad>
        <table className="w-full">
          <thead>
            <tr className="border-b border-apex-bdr bg-apex-s2">
              <th className="px-4 py-2.5 text-left text-xs font-medium text-apex-txt3 uppercase tracking-wide">Contacto</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-apex-txt3 uppercase tracking-wide">Empresa</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-apex-txt3 uppercase tracking-wide">Estado</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-apex-txt3 uppercase tracking-wide">Score</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-apex-txt3 uppercase tracking-wide">Valor</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-apex-txt3 uppercase tracking-wide">Último contacto</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-apex-txt3 uppercase tracking-wide"></th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-apex-txt2">
                  No hay contactos que coincidan con tu búsqueda
                </td>
              </tr>
            ) : (
              filteredContacts.map((contact, i) => (
                <tr
                  key={contact.id}
                  className="border-b border-apex-bdr hover:bg-apex-s2 transition-colors last:border-0"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full ${getAvatarColor(i)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                      >
                        {getInitials(contact.first_name, contact.last_name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-apex-txt truncate">
                          {contact.first_name} {contact.last_name}
                        </p>
                        <p className="text-xs text-apex-txt2 truncate">{contact.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-apex-txt">-</td>
                  <td className="px-4 py-3">
                    <Badge status={contact.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1 bg-apex-s2 rounded overflow-hidden">
                        <div
                          className="h-full bg-apex-gold"
                          style={{ width: `${contact.score}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-apex-txt2 w-8">{contact.score}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold text-apex-gold">
                    ${contact.value?.toLocaleString() || 0}
                  </td>
                  <td className="px-4 py-3 text-xs text-apex-txt2">—</td>
                  <td className="px-4 py-3">
                    <Link href={`/contacts/${contact.id}`}>
                      <Button variant="ghost" size="sm">
                        Ver →
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

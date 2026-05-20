'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useContacts } from '@/hooks/useContacts'
import type { Contact } from '@/lib/types'

export default function ContactDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { getContact } = useContacts()
  const [contact, setContact] = useState<Contact | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchContact() {
      if (typeof params.id === 'string') {
        const data = await getContact(params.id)
        setContact(data)
      }
      setLoading(false)
    }
    fetchContact()
  }, [params.id, getContact])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-apex-txt2">Cargando...</p>
      </div>
    )
  }

  if (!contact) {
    return (
      <div className="flex items-center justify-center h-screen flex-col gap-4">
        <p className="text-apex-txt2">Contacto no encontrado</p>
        <Button onClick={() => router.back()}>Volver</Button>
      </div>
    )
  }

  const c = contact as Contact

  const getInitials = () => {
    return ((c.first_name || 'N')[0] + (c.last_name || 'A')[0]).toUpperCase()
  }

  const activities = [
    {
      type: 'meeting',
      icon: 'ti-video',
      title: 'Demo de producto — Zoom',
      desc: 'Revisión de módulos de inventario y facturación. Cliente muy interesado en integración con SAP.',
      date: 'Hoy · 10:30 AM · Carlos Andrade',
    },
    {
      type: 'email',
      icon: 'ti-mail',
      title: 'Propuesta enviada',
      desc: 'Enviada propuesta comercial por $240K — contrato anual con 3 años de soporte.',
      date: 'Hace 3 días · Carlos Andrade',
    },
    {
      type: 'call',
      icon: 'ti-phone',
      title: 'Llamada de cualificación',
      desc: '45 min. Identificadas necesidades de automatización de reportes. BANT confirmado.',
      date: 'Hace 8 días · María Torres',
    },
  ]

  const avatarColors = {
    lead: 'bg-purple-900 text-purple-400',
    prospect: 'bg-yellow-900 text-yellow-400',
    customer: 'bg-green-900 text-green-400',
  }

  return (
    <div className="pb-10">
      <PageHeader
        title="Perfil de Contacto"
        subtitle={`${c.first_name} ${c.last_name} · Empresa`}
        actions={
          <>
            <Button variant="outline">
              <i className="ti ti-mail"></i> Email
            </Button>
            <Button variant="outline">
              <i className="ti ti-phone"></i> Llamar
            </Button>
            <Button>
              <i className="ti ti-edit"></i> Editar
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-4 gap-3 px-5">
        {/* Contact Info */}
        <div className="col-span-1">
          <Card className="mb-3">
            <div
              className={`w-16 h-16 rounded-full ${avatarColors[c.status as keyof typeof avatarColors] || 'bg-gray-900 text-gray-400'} flex items-center justify-center text-2xl font-bold mb-3`}
            >
              {getInitials()}
            </div>
            <h2 className="text-lg font-bold text-apex-txt">{c.first_name} {c.last_name}</h2>
            <p className="text-xs text-apex-txt2 mt-1">-</p>
            <div className="mt-2">
              <Badge status={c.status} />
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <i className="ti ti-building text-apex-txt3 flex-shrink-0 text-xs"></i>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-apex-txt2">Empresa</p>
                  <p className="text-xs text-apex-txt font-medium">-</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <i className="ti ti-mail text-apex-txt3 flex-shrink-0 text-xs"></i>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-apex-txt2">Email</p>
                  <p className="text-xs text-apex-txt font-medium break-all">{c.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <i className="ti ti-phone text-apex-txt3 flex-shrink-0 text-xs"></i>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-apex-txt2">Teléfono</p>
                  <p className="text-xs text-apex-txt font-medium">{c.phone || '-'}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <i className="ti ti-currency-dollar text-apex-txt3 flex-shrink-0 text-xs"></i>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-apex-txt2">Valor</p>
                  <p className="text-xs text-apex-gold font-bold">${c.value?.toLocaleString() || 0}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <i className="ti ti-star text-apex-txt3 flex-shrink-0 text-xs"></i>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-apex-txt2">Score</p>
                  <p className="text-xs text-apex-gold font-bold">{c.score} / 100</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <p className="text-xs font-semibold text-apex-txt3 uppercase tracking-wide mb-3">Deals Asociados</p>
            <div className="space-y-2">
              <div className="bg-apex-s2 border border-apex-bdr rounded-lg p-2.5">
                <p className="text-xs font-semibold text-apex-txt mb-1">Contrato Anual 2026</p>
                <div className="flex justify-between items-center">
                  <Badge status="prospect" />
                  <span className="text-xs font-semibold text-apex-gold">$240K</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Timeline */}
        <div className="col-span-3">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-apex-txt">Timeline de Actividades</h3>
              <Button variant="outline" size="sm">
                <i className="ti ti-plus"></i> Actividad
              </Button>
            </div>

            <div className="space-y-0 relative">
              <div className="absolute left-3.5 top-6 bottom-0 w-px bg-apex-bdr"></div>

              {activities.map((activity, i) => (
                <div key={i} className="flex gap-3 pb-4 relative">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 relative z-10 ${
                      activity.type === 'meeting'
                        ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                        : activity.type === 'email'
                          ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                          : 'bg-green-500/15 text-green-400 border border-green-500/30'
                    }`}
                  >
                    <i className={`ti ${activity.icon}`}></i>
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-xs font-semibold text-apex-txt">{activity.title}</p>
                    <p className="text-xs text-apex-txt2 mt-1 leading-relaxed">{activity.desc}</p>
                    <p className="text-xs text-apex-txt3 mt-2">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
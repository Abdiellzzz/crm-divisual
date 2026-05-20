'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useDeals } from '@/hooks/useDeals'
import { useContacts } from '@/hooks/useContacts'
import type { Deal } from '@/lib/types'

export default function DashboardPage() {
  const { deals: rawDeals } = useDeals()
  const deals = rawDeals as Deal[]
  const { contacts } = useContacts()
  const [kpis, setKpis] = useState({
    revenue: '$2.84M',
    activeDeals: 143,
    closeRate: '67%',
    avgTicket: '$19.8K',
  })

  useEffect(() => {
    if (deals.length > 0) {
      const totalRevenue = deals.reduce((sum, deal) => sum + (deal.amount || 0), 0)
      const closedDeals = deals.filter(d => d.stage === 'closed_won').length
      const closeRate = deals.length > 0 ? Math.round((closedDeals / deals.length) * 100) : 0
      const avgTicket = deals.length > 0 ? Math.round(totalRevenue / deals.length) : 0

      setKpis({
        revenue: `$${(totalRevenue / 1000000).toFixed(2)}M`,
        activeDeals: deals.filter(d => !d.stage.includes('closed')).length,
        closeRate: `${closeRate}%`,
        avgTicket: `$${avgTicket.toLocaleString()}`,
      })
    }
  }, [deals])

  const stages = [
    { name: 'Prospección', count: 28, value: '$420K', color: '#8B5CF6' },
    { name: 'Calificación', count: 35, value: '$680K', color: '#FAC51C' },
    { name: 'Propuesta', count: 30, value: '$1.1M', color: '#06B6D4' },
    { name: 'Negociación', count: 24, value: '$890K', color: '#2ECC71' },
    { name: 'Cierre', count: 18, value: '$640K', color: '#F39C12' },
  ]

  const activities = [
    { type: 'meeting', title: 'Demo con Grupo Meridian', sub: 'Carlos Andrade · Zoom', time: 'Hoy, 3:00 PM' },
    { type: 'call', title: 'Llamada de seguimiento', sub: 'Industrias Del Sur', time: 'Hoy, 5:30 PM' },
    { type: 'email', title: 'Enviar propuesta técnica', sub: 'TechNova Solutions', time: 'Mañana, 9:00 AM' },
  ]

  return (
    <div className="pb-10">
      <PageHeader
        title="Vista General"
        subtitle="Mayo 2026 · Actualizado hace 3 min"
        actions={
          <>
            <Button variant="outline">Exportar</Button>
            <Button>+ Nuevo Deal</Button>
          </>
        }
      />

      {/* KPI Grid */}
      <div className="grid grid-cols-4 gap-3 px-5 mb-5">
        <Card>
          <div className="relative">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-apex-gold rounded-full"></div>
            <p className="text-xs font-semibold text-apex-txt2 uppercase tracking-wide mb-2">Revenue Total</p>
            <p className="text-2xl font-bold text-apex-gold mb-1">{kpis.revenue}</p>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <i className="ti ti-trending-up"></i> +18.4% vs mes anterior
            </p>
          </div>
        </Card>

        <Card>
          <div className="relative">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-green-500 rounded-full"></div>
            <p className="text-xs font-semibold text-apex-txt2 uppercase tracking-wide mb-2">Deals Activos</p>
            <p className="text-2xl font-bold text-green-400 mb-1">{kpis.activeDeals}</p>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <i className="ti ti-trending-up"></i> +12 esta semana
            </p>
          </div>
        </Card>

        <Card>
          <div className="relative">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full"></div>
            <p className="text-xs font-semibold text-apex-txt2 uppercase tracking-wide mb-2">Tasa de Cierre</p>
            <p className="text-2xl font-bold text-orange-400 mb-1">{kpis.closeRate}</p>
            <p className="text-xs text-red-400 flex items-center gap-1">
              <i className="ti ti-trending-down"></i> -3.2% este mes
            </p>
          </div>
        </Card>

        <Card>
          <div className="relative">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full"></div>
            <p className="text-xs font-semibold text-apex-txt2 uppercase tracking-wide mb-2">Ticket Promedio</p>
            <p className="text-2xl font-bold text-purple-400 mb-1">{kpis.avgTicket}</p>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <i className="ti ti-trending-up"></i> +7.1% vs Q1
            </p>
          </div>
        </Card>
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-3 gap-3 px-5">
        <div className="col-span-2 space-y-3">
          <Card>
            <p className="text-sm font-semibold text-apex-txt mb-4">Distribución por Etapa</p>
            <div className="space-y-2">
              {stages.map((stage) => (
                <div key={stage.name} className="flex items-center gap-3">
                  <span className="text-xs text-apex-txt2 w-20 text-right flex-shrink-0">{stage.name}</span>
                  <div className="flex-1 h-2.5 bg-apex-s2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${stage.count * 3}%`, backgroundColor: stage.color }}
                    ></div>
                  </div>
                  <span className="text-xs text-apex-txt2 w-8 text-right flex-shrink-0">{stage.count}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-apex-txt">Próximas Actividades</p>
            <Button variant="outline" size="sm">Ver todo</Button>
          </div>
          <div className="space-y-3">
            {activities.map((activity, i) => (
              <div key={i} className="flex gap-2 pb-3 border-b border-apex-bdr last:border-0 last:pb-0">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                  style={{
                    backgroundColor:
                      activity.type === 'meeting'
                        ? '#FAC51C'
                        : activity.type === 'call'
                          ? '#2ECC71'
                          : '#8B5CF6',
                  }}
                ></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-apex-txt">{activity.title}</p>
                  <p className="text-xs text-apex-txt2 truncate">{activity.sub}</p>
                  <p className="text-xs text-apex-txt3 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
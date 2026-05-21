'use client'

import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { KanbanBoard } from '@/components/pipeline/KanbanBoard'
import { useDeals } from '@/hooks/useDeals'

export default function PipelinePage() {
  const { deals: rawDeals } = useDeals()
  const deals = (rawDeals || []) as any[]

  const stages = [
    { label: 'Prospección', value: '$420K' },
    { label: 'Calificación', value: '$680K' },
    { label: 'Propuesta', value: '$1.1M' },
    { label: 'Negociación', value: '$890K' },
    { label: 'Cierre', value: '$640K' },
    { label: 'Ganados/Perdidos', value: '32 / 8' },
  ]

  const totalValue = deals.reduce((sum, deal) => sum + (deal.amount || 0), 0)

  return (
    <div className="pb-10">
      <PageHeader
        title="Pipeline de Ventas"
        subtitle={`${deals.length} deals · $${(totalValue / 1000000).toFixed(1)}M en curso`}
        actions={
          <>
            <Button variant="outline">
              <i className="ti ti-filter"></i> Filtrar
            </Button>
            <Button>+ Nuevo Deal</Button>
          </>
        }
      />

      {/* Stats */}
      <div className="px-5 mb-4 flex gap-2 overflow-x-auto pb-2">
        {stages.map((stage, i) => (
          <Card key={i} className="flex-shrink-0 px-3 py-2 min-w-fit">
            <p className="text-xs text-apex-txt2 uppercase font-medium tracking-wide">
              {stage.label}
            </p>
            <p className="text-sm font-bold text-apex-txt mt-1">{stage.value}</p>
          </Card>
        ))}
      </div>

      {/* Kanban Board */}
      <KanbanBoard />
    </div>
  )
}

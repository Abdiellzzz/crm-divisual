'use client'

import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useState, useEffect } from 'react'
import { DealCard } from './DealCard'
import { useDeals } from '@/hooks/useDeals'
import type { Deal } from '@/lib/types'

const STAGES = [
  { id: 'prospection', label: 'Prospección', color: '#8B5CF6', value: '$420K' },
  { id: 'qualification', label: 'Calificación', color: '#FAC51C', value: '$680K' },
  { id: 'proposal', label: 'Propuesta enviada', color: '#06B6D4', value: '$1.1M' },
  { id: 'negotiation', label: 'Negociación', color: '#2ECC71', value: '$890K' },
  { id: 'closing', label: 'Cierre pendiente', color: '#F39C12', value: '$640K' },
  { id: 'closed_won', label: 'Ganado / Cerrado', color: '#E74C3C', value: '$470K' },
]

export function KanbanBoard() {
  const { deals, updateDealStage } = useDeals()
  const [dealsMap, setDealsMap] = useState<Record<string, Deal[]>>({})
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { distance: 8 }),
    useSensor(KeyboardSensor)
  )

  useEffect(() => {
    const map: Record<string, Deal[]> = {}
    STAGES.forEach(stage => {
      map[stage.id] = deals.filter(d => d.stage === stage.id)
    })
    setDealsMap(map)
  }, [deals])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const sourceStageId = Object.entries(dealsMap).find(([_, stageDealsa]) =>
      stageDealsa.some(d => d.id === String(active.id))
    )?.[0]

    const overStageId = Object.entries(dealsMap).find(([_, stageDealsa]) =>
      stageDealsa.some(d => d.id === String(over.id))
    )?.[0] || over.id

    if (sourceStageId && overStageId && sourceStageId !== overStageId) {
      updateDealStage(String(active.id), overStageId)
    }

    setActiveId(null)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={(event) => setActiveId(String(event.active.id))}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-3 overflow-x-auto pb-2 px-5">
        {STAGES.map((stage) => (
          <div key={stage.id} className="flex-shrink-0 w-52">
            <div className="bg-apex-s1 border border-apex-bdr rounded-xl overflow-hidden">
              {/* Header */}
              <div
                className="px-3.5 py-3 border-b border-apex-bdr relative"
                style={{
                  backgroundImage: `linear-gradient(to right, ${stage.color}20 0%, transparent 100%)`,
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: stage.color }}
                ></div>
                <p className="text-xs font-semibold text-apex-txt flex items-center justify-between">
                  {stage.label}
                  <span className="text-xs text-apex-txt3 font-normal">
                    {dealsMap[stage.id]?.length || 0}
                  </span>
                </p>
                <p className="text-xs text-apex-txt2 mt-1">{stage.value}</p>
              </div>

              {/* Cards Container */}
              <div className="p-2.5 min-h-72 space-y-2">
                <SortableContext
                  items={dealsMap[stage.id]?.map(d => d.id) || []}
                  strategy={verticalListSortingStrategy}
                >
                  {dealsMap[stage.id]?.map((deal) => (
                    <DealCard
                      key={deal.id}
                      deal={deal}
                      isDragging={activeId === deal.id}
                    />
                  ))}
                </SortableContext>
                {(!dealsMap[stage.id] || dealsMap[stage.id].length === 0) && (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-xs text-apex-txt3">No hay deals</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </DndContext>
  )
}

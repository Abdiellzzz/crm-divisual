'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Deal } from '@/lib/types'

interface DealCardProps {
  deal: Deal
  isDragging?: boolean
}

export function DealCard({ deal, isDragging }: DealCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSorting,
  } = useSortable({ id: deal.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSorting ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-apex-s2 border border-apex-bdr rounded-lg p-2.5 cursor-grab hover:border-apex-bdr2 hover:-translate-y-0.5 transition-all ${
        isSorting ? 'cursor-grabbing opacity-50' : ''
      }`}
    >
      <p className="text-xs font-semibold text-apex-txt mb-1 line-clamp-1">-</p>
      <p className="text-xs text-apex-txt2 mb-2 line-clamp-1">-</p>
      <div className="flex justify-between items-end mb-2">
        <span className="text-xs font-semibold text-apex-gold">${deal.amount?.toLocaleString()}</span>
        <span className="text-xs text-apex-txt3">{deal.probability}%</span>
      </div>
      <div className="flex items-center gap-1 text-xs text-apex-txt3">
        <i className="ti ti-calendar text-xs"></i>
        {deal.expected_close_date ? new Date(deal.expected_close_date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }) : '—'}
      </div>
    </div>
  )
}

'use client'

import { ContactStatus } from '@/lib/types'

interface BadgeProps {
  status: ContactStatus | string
  className?: string
}

export function Badge({ status, className = '' }: BadgeProps) {
  const statusConfig = {
    lead: { bg: 'bg-purple-500/15', text: 'text-purple-400', label: 'Lead' },
    prospect: { bg: 'bg-yellow-500/15', text: 'text-yellow-400', label: 'Prospect' },
    customer: { bg: 'bg-green-500/15', text: 'text-green-400', label: 'Customer' },
  }

  const config = statusConfig[status as ContactStatus] || { bg: 'bg-gray-500/15', text: 'text-gray-400', label: status }

  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.bg} ${config.text} ${className}`}
    >
      {config.label}
    </span>
  )
}

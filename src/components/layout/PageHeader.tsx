'use client'

import { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-5 px-5 pt-5">
      <div>
        <h1 className="text-xl font-semibold text-apex-txt">{title}</h1>
        {subtitle && <p className="text-xs text-apex-txt2 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex gap-2">{actions}</div>
    </div>
  )
}

'use client'

import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  noPad?: boolean
}

export function Card({ children, className = '', noPad = false }: CardProps) {
  return (
    <div
      className={`bg-apex-s1 border border-apex-bdr rounded-xl ${!noPad && 'p-4'} ${className}`}
    >
      {children}
    </div>
  )
}

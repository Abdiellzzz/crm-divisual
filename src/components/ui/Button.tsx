'use client'

import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  variant = 'gold',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseClasses = 'font-medium rounded-lg transition-colors inline-flex items-center gap-2'

  const variantClasses = {
    gold: 'bg-apex-gold text-black hover:bg-apex-gold2 disabled:opacity-50',
    outline: 'bg-transparent border border-apex-bdr text-apex-txt2 hover:border-apex-gold2 hover:text-apex-gold disabled:opacity-50',
    ghost: 'bg-transparent text-apex-txt2 hover:text-apex-txt disabled:opacity-50',
  }

  const sizeClasses = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

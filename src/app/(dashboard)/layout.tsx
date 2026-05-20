'use client'

import { Navbar } from '@/components/layout/Navbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-screen bg-apex-bg">
      <Navbar />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}

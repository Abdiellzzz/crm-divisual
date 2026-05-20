'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import type { Deal } from '@/lib/types'

export function useDeals() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchDeals()
  }, [])

  const fetchDeals = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false })

      if (err) throw err
      setDeals((data as Deal[]) || [])
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const updateDealStage = useCallback(
    async (dealId: string, stage: string) => {
      try {
        const { error: err } = await supabase
          .from('deals')
          .update({ stage, updated_at: new Date().toISOString() })
          .eq('id', dealId)

        if (err) throw err
        await fetchDeals()
      } catch (err) {
        setError((err as Error).message)
      }
    },
    [supabase, fetchDeals]
  )

  const createDeal = useCallback(
    async (deal: Omit<Deal, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        const { error: err, data } = await supabase
          .from('deals')
          .insert([deal])
          .select()

        if (err) throw err
        await fetchDeals()
        return data?.[0]
      } catch (err) {
        setError((err as Error).message)
        throw err
      }
    },
    [supabase, fetchDeals]
  )

  return {
    deals,
    loading,
    error,
    fetchDeals,
    updateDealStage,
    createDeal,
  }
}
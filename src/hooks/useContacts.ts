'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import type { Contact } from '@/lib/types'

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })

      if (err) throw err
      setContacts(data || [])
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const getContact = useCallback(
    async (id: string) => {
      try {
        const { data, error: err } = await supabase
          .from('contacts')
          .select('*')
          .eq('id', id)
          .single()

        if (err) throw err
        return data
      } catch (err) {
        setError((err as Error).message)
        return null
      }
    },
    [supabase]
  )

  const updateContact = useCallback(
    async (id: string, updates: Partial<Contact>) => {
      try {
        const { error: err } = await supabase
          .from('contacts')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)

        if (err) throw err
        await fetchContacts()
      } catch (err) {
        setError((err as Error).message)
      }
    },
    [supabase, fetchContacts]
  )

  const createContact = useCallback(
    async (contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        const { error: err, data } = await supabase
          .from('contacts')
          .insert([
            {
              ...contact,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ])
          .select()

        if (err) throw err
        await fetchContacts()
        return data?.[0]
      } catch (err) {
        setError((err as Error).message)
        throw err
      }
    },
    [supabase, fetchContacts]
  )

  return {
    contacts,
    loading,
    error,
    fetchContacts,
    getContact,
    updateContact,
    createContact,
  }
}

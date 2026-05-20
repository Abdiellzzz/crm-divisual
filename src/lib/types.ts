export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string
          avatar_url?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string
          created_at?: string
        }
      }
      companies: {
        Row: {
          id: string
          name: string
          industry: string | null
          website: string | null
          city: string | null
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          industry?: string
          website?: string
          city?: string
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          industry?: string
          website?: string
          city?: string
          created_by?: string
          created_at?: string
        }
      }
      contacts: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone: string | null
          company_id: string | null
          status: 'lead' | 'prospect' | 'customer'
          score: number
          owner_id: string
          value: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email: string
          phone?: string
          company_id?: string
          status?: 'lead' | 'prospect' | 'customer'
          score?: number
          owner_id: string
          value?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string
          company_id?: string
          status?: 'lead' | 'prospect' | 'customer'
          score?: number
          owner_id?: string
          value?: number
          created_at?: string
          updated_at?: string
        }
      }
      deals: {
        Row: {
          id: string
          name: string
          amount: number
          currency: string
          stage: string
          probability: number
          expected_close_date: string | null
          type: string
          contact_id: string | null
          company_id: string | null
          owner_id: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          amount: number
          currency?: string
          stage?: string
          probability?: number
          expected_close_date?: string
          type?: string
          contact_id?: string
          company_id?: string
          owner_id: string
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          amount?: number
          currency?: string
          stage?: string
          probability?: number
          expected_close_date?: string
          type?: string
          contact_id?: string
          company_id?: string
          owner_id?: string
          notes?: string
          created_at?: string
          updated_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          type: 'meeting' | 'call' | 'email' | 'deadline' | 'deal_created'
          title: string
          description: string | null
          contact_id: string | null
          deal_id: string | null
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          type: 'meeting' | 'call' | 'email' | 'deadline' | 'deal_created'
          title: string
          description?: string
          contact_id?: string
          deal_id?: string
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          type?: 'meeting' | 'call' | 'email' | 'deadline' | 'deal_created'
          title?: string
          description?: string
          contact_id?: string
          deal_id?: string
          created_by?: string
          created_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}

// Domain models
export interface Company extends Database['public']['Tables']['companies']['Row'] {}
export interface Contact extends Database['public']['Tables']['contacts']['Row'] {}
export interface Deal extends Database['public']['Tables']['deals']['Row'] {}
export interface Activity extends Database['public']['Tables']['activities']['Row'] {}
export interface Profile extends Database['public']['Tables']['profiles']['Row'] {}

// UI types
export type ContactStatus = 'lead' | 'prospect' | 'customer'
export type ActivityType = 'meeting' | 'call' | 'email' | 'deadline' | 'deal_created'
export type DealStage = 'prospection' | 'qualification' | 'proposal' | 'negotiation' | 'closing' | 'closed_won' | 'closed_lost'

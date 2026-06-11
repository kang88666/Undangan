import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Wish = {
  id: string
  name: string
  attendance: 'Hadir' | 'Ragu-ragu' | 'Tidak Hadir'
  message: string
  created_at: string
}

export type Guest = {
  id: string
  name: string
  category: string
  slug: string
  created_at: string
}

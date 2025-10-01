// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key environment variables must be defined.')
}

// 👇 ¡Solo dos genéricos! Y uno es 'public'
const supabase = createClient<Database, 'public'>(supabaseUrl, supabaseKey)

export default supabase

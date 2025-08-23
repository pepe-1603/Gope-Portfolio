// src/lib/supabaseClient.js (o src/utils/supabaseClient.js, etc.)

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL // Asegúrate de usar el prefijo correcto
const supabaseKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY // Asegúrate de usar el prefijo correcto

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Las variables de entorno de Supabase URL y Key deben estar definidas.')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase

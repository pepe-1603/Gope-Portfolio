// src/lib/supabaseClient.ts

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key environment variables must be defined.');
}

/**
 * Crea una instancia del cliente de Supabase.
 * La tipificación con `<Database>` permite una inferencia de tipos segura para todas las tablas, vistas y RPCs.
 */
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export default supabase;

// src/lib/typedSupabase.ts

import supabase from './supabaseClient'
import type { Database } from '@/types/supabase'

type PublicSchema = Database['public']
export type TableName = keyof PublicSchema['Tables']

/**
 * Accede a una tabla tipada de Supabase.
 *
 * @param table El nombre de la tabla (debe ser clave exacta del esquema 'public').
 * @returns Una instancia de la tabla con tipado fuerte.
 */
export function fromTypedTable<K extends TableName>(table: K) {
  // Simplemente llama a .from(table) en el cliente tipado.
  // Los tipos de Row, Insert, y Update se infieren correctamente del tipo 'Database'.
  return supabase.from(table)
}

// src/services/techService.ts

import supabase from '@/lib/supabaseClient'
import type { Tables } from '@/types/supabase'

const TECHS_TABLE = 'techs'

/**
 * Servicio para interactuar con la tabla de 'techs' en Supabase.
 * Proporciona métodos para obtener, crear y eliminar tecnologías.
 */
export const techService = {
  /**
   * Obtiene todas las tecnologías de la base de datos.
   * @returns {Promise<Tables<'techs'>[] | null>} Una promesa que resuelve con un array de tecnologías o null en caso de error.
   */
  getAllTechs: async (): Promise<Tables<'techs'>[] | null> => {
    try {
      const { data, error } = await supabase.from(TECHS_TABLE).select('*')
      if (error) {
        console.error('Error fetching all technologies:', error.message)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error in getAllTechs:', error)
      throw error
    }
  },

  /**
   * Crea una nueva tecnología.
   * @param techData Los datos de la nueva tecnología.
   * @returns {Promise<Tables<'techs'>>} Una promesa que resuelve con el objeto de la tecnología creada.
   */
  createTech: async (techData: Tables<'techs'>['Insert']): Promise<Tables<'techs'>> => {
    try {
      const { data, error } = await supabase
        .from(TECHS_TABLE)
        .insert(techData)
        .select()
        .single()
      if (error) {
        console.error('Error creating technology:', error.message)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error in createTech:', error)
      throw error
    }
  },

  /**
   * Actualiza una tecnología existente por su ID.
   * @param id El ID de la tecnología a actualizar.
   * @param techData Los datos a actualizar de la tecnología.
   * @returns {Promise<Tables<'techs'>>} Una promesa que resuelve con el objeto de la tecnología actualizada.
   */
  updateTech: async (
    id: string,
    techData: Tables<'techs'>['Update'],
  ): Promise<Tables<'techs'>> => {
    try {
      const { data, error } = await supabase
        .from(TECHS_TABLE)
        .update(techData)
        .eq('id', id)
        .select()
        .single()
      if (error) {
        console.error('Error updating technology:', error.message)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error in updateTech:', error)
      throw error
    }
  },

  /**
   * Elimina una tecnología por su ID.
   * @param id El ID de la tecnología a eliminar.
   * @returns {Promise<void>} Una promesa que no resuelve con ningún valor.
   */
  deleteTech: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase.from(TECHS_TABLE).delete().eq('id', id)
      if (error) {
        console.error('Error deleting technology:', error.message)
        throw error
      }
    } catch (error) {
      console.error('Error in deleteTech:', error)
      throw error
    }
  },
}

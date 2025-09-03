// src/services/experienceService.ts

import supabase from '@/lib/supabaseClient'
import type { Tables } from '@/types/supabase'

const EXPERIENCE_TABLE = 'work_experience'

export const experienceService = {
  /**
   * Obtiene toda la experiencia laboral en orden cronológico.
   * @returns {Promise<Tables<'work_experience'>[] | null>}
   */
  getAllExperience: async (): Promise<Tables<'work_experience'>[] | null> => {
    try {
      const { data, error } = await supabase
        .from(EXPERIENCE_TABLE)
        .select('*')
        .order('start_date', { ascending: false })

      if (error) {
        console.error('Error getting work experience:', error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error getting work experience:', error)
      throw error
    }
  },

  /**
   * Crea un nuevo registro de experiencia laboral.
   * @param experienceData Los datos de la nueva experiencia.
   * @returns {Promise<Tables<'work_experience'>>}
   */
  createExperience: async (
    experienceData: Tables<'work_experience'>['Insert'],
  ): Promise<Tables<'work_experience'>> => {
    const { data, error } = await supabase
      .from(EXPERIENCE_TABLE)
      .insert([experienceData])
      .select()

    if (error) {
      console.error('Error creating work experience:', error)
      throw error
    }
    return data[0]
  },

  /**
   * Actualiza un registro de experiencia laboral existente.
   * @param id El ID del registro a actualizar.
   * @param experienceData Los datos para actualizar.
   * @returns {Promise<Tables<'work_experience'>>}
   */
  updateExperience: async (
    id: string,
    experienceData: Tables<'work_experience'>['Update'],
  ): Promise<Tables<'work_experience'>> => {
    const { data, error } = await supabase
      .from(EXPERIENCE_TABLE)
      .update(experienceData)
      .eq('id', id)
      .select()

    if (error) {
      console.error('Error updating work experience:', error)
      throw error
    }
    return data[0]
  },

  /**
   * Elimina un registro de experiencia laboral.
   * @param id El ID del registro a eliminar.
   * @returns {Promise<void>}
   */
  deleteExperience: async (id: string): Promise<void> => {
    const { error } = await supabase.from(EXPERIENCE_TABLE).delete().eq('id', id)

    if (error) {
      console.error('Error deleting work experience:', error)
      throw error
    }
  },
}

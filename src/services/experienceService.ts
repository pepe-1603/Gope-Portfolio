// src/services/experienceService.ts

import supabase from '@/lib/supabaseClient'
import type { Tables, TablesInsert, TablesUpdate } from '@/types/supabase'
import { activityService } from './activityService'

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
    experienceData: TablesInsert<'work_experience'>, // Usamos el nuevo tipo
  ): Promise<Tables<'work_experience'>> => {
    const { data, error } = await supabase.from(EXPERIENCE_TABLE).insert([experienceData]).select()

    if (error) {
      console.error('Error creating work experience:', error)
      throw error
    }
    // ✅ LOG DE ACTIVIDAD: Creación
    const newExperience = data[0]
    await activityService.logActivity(
      'CREATE',
      'experience', // Tipo de Recurso
      `Experiencia laboral '${newExperience.company}' creada.`, // Descripción
      newExperience.id,
    )
    return newExperience
  },

  /**
   * Actualiza un registro de experiencia laboral existente.
   * @param id El ID del registro a actualizar.
   * @param experienceData Los datos para actualizar.
   * @returns {Promise<Tables<'work_experience'>>}
   */
  updateExperience: async (
    id: string,
    experienceData: TablesUpdate<'work_experience'>, // Usamos el nuevo tipo
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

    // ✅ LOG DE ACTIVIDAD: Actualización
    const updatedExperience = data[0]
    await activityService.logActivity(
      'UPDATE',
      'experience', // Tipo de Recurso
      `Experiencia laboral '${updatedExperience.company}' actualizada.`, // Descripción
      id,
    )
    return updatedExperience
  },

  /**
   * Elimina un registro de experiencia laboral.
   * @param id El ID del registro a eliminar.
   * @returns {Promise<void>}
   */
  deleteExperience: async (id: string): Promise<void> => {
    // Opcional: Obtener datos antes de eliminar para un log más descriptivo
    const { data: experienceBeforeDelete } = await supabase
      .from(EXPERIENCE_TABLE)
      .select('company')
      .eq('id', id)
      .single()

    const { error } = await supabase.from(EXPERIENCE_TABLE).delete().eq('id', id)

    if (error) {
      console.error('Error deleting work experience:', error)
      throw error
    }

    // ✅ LOG DE ACTIVIDAD: Eliminación
    const companyName = experienceBeforeDelete?.company || `ID: ${id}`
    await activityService.logActivity(
      'DELETE',
      'experience', // Tipo de Recurso
      `Experiencia laboral '${companyName}' eliminada.`, // Descripción
      id,
    )
  },
}

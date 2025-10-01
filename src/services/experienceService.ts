// src/services/experienceService.ts

import supabase from '@/lib/supabaseClient'
import type { Tables, TablesInsert, TablesUpdate } from '@/types/supabase'
import { activityService } from './activityService'
import { fromTypedTable } from '@/lib/typedSupabase' // Solo necesitamos fromTypedTable
import { TABLES } from '@/constants/tables'

export const experienceService = {
  /**
   * Obtiene toda la experiencia laboral en orden cronológico.
   * @returns {Promise<Tables<'work_experience'>[] | null>}
   */
  getAllExperience: async (): Promise<Tables<'work_experience'>[] | null> => {
    try {
      const { data, error } = await supabase
        .from(TABLES.EXPERIENCE)
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
   */
  createExperience: async (
    experienceData: TablesInsert<'work_experience'>,
  ): Promise<Tables<'work_experience'>> => {
    // ✅ CORRECCIÓN: El error .insert desaparece porque fromTypedTable ahora funciona.
    const { data, error } = await fromTypedTable('work_experience')
      .insert([experienceData] as any) //puse any y el error desaparecio pero ajora arca el error en any: Unexpected any. Specify a different type.eslint@typescript-eslint/no-explicit-any ¿es necesario este rror o lo ignoramos?
      .select()

    if (error) {
      console.error('Error creating work experience:', error)
      throw error
    }

    const newExperience = data[0]
    await activityService.logActivity(
      'CREATE',
      'experience',
      `Experiencia laboral '${newExperience.company}' creada.`,
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
      .from(TABLES.EXPERIENCE)
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
      .from(TABLES.EXPERIENCE)
      .select('company')
      .eq('id', id)
      .single()

    const { error } = await supabase.from(TABLES.EXPERIENCE).delete().eq('id', id)

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

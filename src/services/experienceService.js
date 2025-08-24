// src/services/experienceService.js
import supabase from '@/lib/supabaseClient'

const EXPERIENCE_TABLE = 'work_experience'

export const experienceService = {
  /**
   * Obtiene toda la experiencia laboral en orden cronológico.
   * @returns {Promise<Array>} - Una promesa que resuelve con la lista de experiencias.
   */
  getAllExperience: async () => {
    try {
      const { data, error } = await supabase
        .from(EXPERIENCE_TABLE)
        .select('*')
        .order('start_date', { ascending: false }) // Ordena de más reciente a más antiguo

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting work experience:', error)
      throw error
    }
  },

  // Opcional: Métodos para crear, actualizar y eliminar experiencia (para un panel de administración)
  // createExperience: async (experienceData) => { ... },
  // updateExperience: async (id, experienceData) => { ... },
  // deleteExperience: async (id) => { ... },
}

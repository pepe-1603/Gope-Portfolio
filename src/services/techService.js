// src/services/techService.js

import supabase from '../lib/supabaseClient'

const TECHS_TABLE = 'techs'

export const techService = {
  // READ (Público)
  getAllTechs: async () => {
    const { data, error } = await supabase
      .from(TECHS_TABLE)
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error al obtener tecnologías:', error.message)
      throw error
    }
    return data
  },

  // CREATE (Administración)
  createTech: async (techData) => {
    const { data, error } = await supabase.from(TECHS_TABLE).insert([techData]).select()

    if (error) {
      console.error('Error al crear tecnología:', error.message)
      throw error
    }
    return data[0]
  },

  // ... UPDATE, DELETE si son necesarios
}

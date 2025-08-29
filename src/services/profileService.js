// src/services/profileService.js

import supabase from '../lib/supabaseClient'

const PROFILES_TABLE = 'user_profiles'

export const profileService = {
  // READ (Público)
  getAdminProfile: async (adminUserId) => {
    // Puedes pasar tu UUID de admin
    const { data, error } = await supabase
      .from(PROFILES_TABLE)
      .select('*')
      .eq('user_id', adminUserId) // Asegúrate de que esta UUID sea pública via RLS
      .single()

    if (error) {
      console.error('Error al obtener el perfil de administrador:', error.message)
      throw error
    }
    console.log('response data-perfil :', data)
    return data
  },

  // UPDATE (Administración - requiere autenticación)
  updateMyProfile: async (profileData) => {
    const { data, error } = await supabase
      .from(PROFILES_TABLE)
      .update(profileData)
      .eq('user_id', supabase.auth.user().id) // Asegura que solo se actualiza el propio perfil
      .select()

    if (error) {
      console.error('Error al actualizar el propio perfil:', error.message)
      throw error
    }
    return data[0]
  },

  //demas metodos
}

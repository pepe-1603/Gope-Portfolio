// src/services/profileService.ts

import supabase from '@/lib/supabaseClient'
import type { Tables } from '@/types/supabase'

const PROFILES_TABLE = 'user_profiles'

export const profileService = {
  /**
   * usado praa mostrar el perfil en las visatas publicas aboutView utilizando la varianble de entorno IdAdmin.
   * Obtiene el perfil de un usuario por su ID.
   * @param userId El UUID del usuario.
   * @returns {Promise<Tables<'user_profiles'> | null>}
   */
  getProfileByUserId: async (userId: string): Promise<Tables<'user_profiles'> | null> => {
    try {
      const { data, error } = await supabase
        .from(PROFILES_TABLE)
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error(`Error al obtener el perfil para el usuario con ID ${userId}:`, error.message)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error en getProfileByUserId:', error)
      throw error
    }
  },

  /**
   * Obtiene el perfil del usuario actualmente autenticado.
   * @returns {Promise<Tables<'user_profiles'> | null>}
   */
  getMyProfile: async (): Promise<Tables<'user_profiles'> | null> => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.error('No se encontró un usuario autenticado.')
      return null
    }

    try {
      const { data, error } = await supabase
        .from(PROFILES_TABLE)
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) {
        console.error('Error al obtener el perfil del usuario actual:', error.message)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error en getMyProfile:', error)
      throw error
    }
  },

  /**
   * Crea un nuevo perfil de usuario.
   * @param profileData Los datos del nuevo perfil.
   * @returns {Promise<Tables<'user_profiles'>>}
   */
  createProfile: async (
    profileData: Tables<'user_profiles'>['Insert'],
  ): Promise<Tables<'user_profiles'>> => {
    const { data, error } = await supabase.from(PROFILES_TABLE).insert([profileData]).select()

    if (error) {
      console.error('Error al crear perfil:', error.message)
      throw error
    }
    return data[0]
  },

  /**
   * Actualiza el perfil de un usuario.
   * @param profileData Los datos para actualizar.
   * @returns {Promise<Tables<'user_profiles'>>}
   */
  updateProfile: async (
    profileData: Tables<'user_profiles'>['Update'],
  ): Promise<Tables<'user_profiles'>> => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.error('No se encontró un usuario autenticado para actualizar el perfil.')
      throw new Error('User not authenticated.')
    }

    const { data, error } = await supabase
      .from(PROFILES_TABLE)
      .update(profileData)
      .eq('user_id', user.id)
      .select()

    if (error) {
      console.error('Error al actualizar el perfil:', error.message)
      throw error
    }
    return data[0]
  },

  // DELETE
  /**
   * Elimina un perfil de usuario.
   * @param userId El UUID del usuario a eliminar.
   * @returns {Promise<void>}
   */
  deleteProfile: async (userId: string): Promise<void> => {
    const { error } = await supabase.from(PROFILES_TABLE).delete().eq('user_id', userId)

    if (error) {
      console.error('Error al eliminar perfil:', error.message)
      throw error
    }
  },
}

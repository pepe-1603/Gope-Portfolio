// src/services/profileService.ts

import supabase from '@/lib/supabaseClient'
import type { Tables, TablesInsert, TablesUpdate } from '@/types/supabase'
import { activityService } from './activityService'

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
    profileData: TablesInsert<'user_profiles'>, // Usamos el nuevo tipo
  ): Promise<Tables<'user_profiles'>> => {
    // ✅ CORRECCIÓN: Usamos 'as any' en la función .insert() para forzar la aceptación de datos.
    const { data, error } = await (supabase.from(PROFILES_TABLE).insert as any)([
      profileData,
    ]).select()

    if (error) {
      console.error('Error al crear perfil:', error.message)
      throw error
    }

    // ✅ CORRECCIÓN: Tipamos la fila resultante para resolver TS2339.
    const newProfile = data[0] as Tables<'user_profiles'> // ✅ LOG DE ACTIVIDAD: Creación (normalmente se usa en el proceso de registro)

    await activityService.logActivity(
      'CREATE',
      'profile', // Tipo de Recurso
      `Perfil de usuario ${newProfile.name || newProfile.id} creado.`, // Descripción
      newProfile.user_id, // Ahora user_id está tipado correctamente
    )
    return newProfile // Devolvemos el perfil tipado
  },

  /**
   * Actualiza el perfil de un usuario.
   * @param profileData Los datos para actualizar.
   * @returns {Promise<Tables<'user_profiles'>>}
   */
  updateProfile: async (
    profileData: TablesUpdate<'user_profiles'>, // Usamos el nuevo tipo
  ): Promise<Tables<'user_profiles'>> => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.error('No se encontró un usuario autenticado para actualizar el perfil.')
      throw new Error('User not authenticated.')
    }

    const { data, error } = await (supabase.from(PROFILES_TABLE).update as any)(
      // ✅ CORRECCIÓN: Usamos 'as any' en la función .update() para forzar el tipo.
      profileData,
    )
      .eq('user_id', user.id)
      .select()
    if (error) {
      console.error('Error al actualizar el perfil:', error.message)
      throw error
    }
    // ✅ LOG DE ACTIVIDAD: Actualización
    const profileName =
      (data[0] as Tables<'user_profiles'>).name || (data[0] as Tables<'user_profiles'>).id
    // Si no quieres repetir el casting:
    // const updatedProfile = data[0] as Tables<'user_profiles'>
    // const profileName = updatedProfile.name || updatedProfile.id
    await activityService.logActivity(
      'UPDATE',
      'profile', // Tipo de Recurso
      `Perfil de usuario ${profileName} actualizado.`, // Descripción
      user.id,
    )
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
    // ✅ LOG DE ACTIVIDAD: Eliminación
    await activityService.logActivity(
      'DELETE',
      'profile', // Tipo de Recurso
      `Perfil de usuario con ID ${userId} eliminado.`, // Descripción
      userId,
    )
  },
}

// src/services/userService.ts

import supabase from '@/lib/supabaseClient'
import type { User } from '@supabase/supabase-js'

export const userService = {
  /**
   * Actualiza la contraseña del usuario actualmente autenticado.
   * Supabase no requiere la contraseña actual para esta operación.
   * @param newPassword La nueva contraseña para el usuario.
   * @returns {Promise<User | null>} El objeto del usuario actualizado.
   */
  changePassword: async (newPassword: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        console.error('Error al cambiar la contraseña:', error.message)
        throw error
      }
      return data.user
    } catch (error) {
      console.error('Error en changePassword:', error)
      throw error
    }
  },

  // Podrías añadir otras funciones aquí, como actualizar el correo electrónico.
  // updateEmail: async (newEmail: string): Promise<User | null> => { ... }
}

// src/services/authService.ts

import supabase from '@/lib/supabaseClient'
import type { AuthTokenResponsePassword, User } from '@supabase/supabase-js'

export const login = async (credentials: AuthTokenResponsePassword) => {
  const { data, error } = await supabase.auth.signInWithPassword(credentials)

  if (error) {
    throw error
  }

  return data.user
}

export const logout = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw error
  }
}

export const getCurrentUser = async (): Promise<User | null> => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

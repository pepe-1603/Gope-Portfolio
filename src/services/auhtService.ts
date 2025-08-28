// src/services/authService.ts
import supabase from '@/lib/supabaseClient'

export const login = async (credentials) => {
  const { data, error } = await supabase.auth.signInWithPassword(credentials)

  if (error) {
    throw error
  }

  return data.user
}

export const logout = async () => {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw error
  }
}

export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

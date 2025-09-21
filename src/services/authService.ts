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

// ✅ NUEVO: Función para iniciar el flujo de recuperación de contraseña
export const resetPasswordForEmail = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/update-password`,
  })

  if (error) {
    throw error
  }
  return data
}

// ✅ NUEVO: Función para reenviar el correo de verificación
export const resendVerificationEmail = async (): Promise<void> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error(
        'No se encontró un usuario autenticado para enviar el correo de verificación.',
      )
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email!,
    })

    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Error al reenviar el correo de verificación:', error)
    throw error
  }
}

// ✅ NUEVO: Inicia la configuración de 2FA. Genera el secreto y el URI para el QR.
export const start2faSetup = async () => {
  const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' })

  if (error) {
    throw error
  }
  return data
}

// ✅ NUEVO: Verificación de 2FA con un código TOTP para confirmar la configuración.
export const verify2fa = async (challengeId: string, code: string) => {
  const { data, error } = await supabase.auth.mfa.challengeAndVerify({
    challengeId,
    code,
  })

  if (error) {
    throw error
  }
  return data
}

// ✅ NUEVO: Deshabilita 2FA en la cuenta del usuario.
export const disable2fa = async () => {
  const { data, error } = await supabase.auth.mfa.unenroll()

  if (error) {
    throw error
  }
  return data
}

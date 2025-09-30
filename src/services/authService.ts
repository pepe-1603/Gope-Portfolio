// src/services/authService.ts

import supabase from '@/lib/supabaseClient'
import type { AuthTokenResponsePassword, User } from '@supabase/supabase-js'
import { activityService } from './activityService'

export const login = async (credentials: AuthTokenResponsePassword) => {
  const { data, error } = await supabase.auth.signInWithPassword(credentials)

  if (error) {
    throw error
  } // Nota: El email del usuario será capturado automáticamente dentro de logActivity
  // ✅ LOG DE ACTIVIDAD: Inicio de Sesión
  await activityService.logActivity(
    'LOGIN', // Nueva acción: LOGIN
    'auth', // Tipo de Recurso
    `Inicio de sesión exitoso.`, // Descripción
  )
  return data.user
}

export const logout = async (): Promise<void> => {
  // 🛑 Nota: Necesitamos obtener el usuario ANTES de desloguearlo
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { error } = await supabase.auth.signOut()

  if (error) {
    throw error
  } // Usamos el email que Pinia (o el sistema de caché) tenía antes de hacer signOut

  // ✅ LOG DE ACTIVIDAD: Cierre de Sesión
  await activityService.logActivity(
    'LOGOUT', // Nueva acción: LOGOUT
    'auth', // Tipo de Recurso
    `Cierre de sesión manual.`, // Descripción
    user?.id,
  )
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
export const verify2fa = async (factorId: string, code: string) => {
  const { data, error } = await supabase.auth.mfa.challengeAndVerify({
    factorId,
    code,
  })

  if (error) {
    throw error
  }
  return data
}

// ✅ NUEVO: Deshabilita 2FA en la cuenta del usuario.
// ✅ MODIFICADO: Ahora la función recibe el factor ID para deshabilitar.
export const disable2fa = async (factorId: string) => {
  const { data, error } = await supabase.auth.mfa.unenroll({
    factorId,
  })

  if (error) {
    throw error
  }
  return data
}

// ✅ NUEVO: Función para encontrar y eliminar factores 2FA sin nombre (factores huérfanos).
export const findAndRemoveOrphanedFactors = async (): Promise<void> => {
  const userResponse = await supabase.auth.getUser()
  const user = userResponse.data?.user

  if (user && user.factors) {
    const orphanedFactors = user.factors.filter((factor) => !factor.friendly_name)

    for (const factor of orphanedFactors) {
      console.log(`Eliminando factor huérfano con ID: ${factor.id}`)
      await supabase.auth.mfa.unenroll({
        factorId: factor.id,
      })
    }
  }
}

// ✅ Desactiva todos los factores de 2FA del usuario actual.
export const disableAll2faFactors = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error) throw error

  if (user?.factors?.length) {
    for (const factor of user.factors) {
      try {
        await supabase.auth.mfa.unenroll({ factorId: factor.id })
      } catch (err) {
        console.warn(`No se pudo eliminar el factor ${factor.id}`, err)
      }
    }
  }
}

//ajustar  para supabase
export async function delete2faFactor(factorId: string): Promise<void> {
  const { error } = await supabase.auth.admin.deleteUserFactor(factorId)
  if (error) throw error
}

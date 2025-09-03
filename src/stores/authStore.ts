// src/stores/authStore.ts
import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  getCurrentUser,
  login as authServiceLogin,
  logout as authServiceLogout,
} from '@/services/authService.ts'
import { profileService } from '@/services/profileService'
import { useToastStore } from '@/stores/toast'
import type { User } from '@supabase/supabase-js'
import type { Tables } from '@/types/supabase'

export const useAuthStore = defineStore(
  'auth',
  () => {
    // Definimos explícitamente los tipos para los estados
    const user = ref<User | null>(null)
    const profile = ref<Tables<'user_profiles'> | null>(null)
    const isAuthenticated = ref<boolean>(false)
    const toastStore = useToastStore()

    const setUserAndProfile = (newUser: User | null, newProfile: Tables<'user_profiles'> | null = null) => {
      user.value = newUser
      profile.value = newProfile
      isAuthenticated.value = !!newUser
    }

    const checkAuth = async () => {
      console.log('🔄 Verificando autenticación...')
      const currentUser = await getCurrentUser()
      if (currentUser) {
        console.log('✅ Autenticación verificada. El usuario está logueado.')
        try {
          // El método getAdminProfile en profileService.js debe ser tipado para esto
          const userProfile = await profileService.getProfileByUserId(currentUser.id)
          setUserAndProfile(currentUser, userProfile)
        } catch (error) {
          console.error('Error al obtener el perfil del usuario:', error)
          setUserAndProfile(currentUser, null)
        }
      } else {
        console.log('❌ No se encontró token. El usuario no está logueado.')
        setUserAndProfile(null, null)
      }
    }

    const fetchProfile = async () => {
      if (user.value) {
        try {
          const userProfile = await profileService.getProfileByUserId(user.value.id)
          profile.value = userProfile
        } catch (error) {
          console.error('Error al recargar el perfil:', error)
          profile.value = null
        }
      }
    }

    const login = async (credentials: any) => {
      try {
        const loggedInUser = await authServiceLogin(credentials)
        if (loggedInUser) {
          const userProfile = await profileService.getProfileByUserId(loggedInUser.id)
          setUserAndProfile(loggedInUser, userProfile)
        }

        toastStore.addToast({
          message: '¡Bienvenido! Has iniciado sesión.',
          type: 'success',
          duration: 5000,
        })
        return true
      } catch (error) {
        toastStore.addToast({
          message: 'Error en el login. Por favor, revisa tus credenciales.',
          type: 'error',
        })
        throw error
      }
    }

    const logout = async () => {
      try {
        await authServiceLogout()
        setUserAndProfile(null, null)
        toastStore.addToast({
          message: 'Sesión cerrada correctamente.',
          type: 'success',
        })
      } catch (error) {
        toastStore.addToast({
          message: 'Error al cerrar sesión. Por favor, inténtalo de nuevo.',
          type: 'error',
        })
        throw error
      }
    }

    return {
      user,
      profile,
      isAuthenticated,
      setUserAndProfile,
      checkAuth,
      fetchProfile,
      login,
      logout,
    }
  },
  {
    persist: true,
  },
)

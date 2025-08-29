// src/stores/authStore.ts
import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  getCurrentUser,
  login as authServiceLogin,
  logout as authServiceLogout,
} from '@/services/auhtService'
import { profileService } from '@/services/profileService' // Importamos el servicio de perfiles
import { useToastStore } from '@/stores/toast'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref(null)
    const profile = ref(null) // Nuevo estado para el perfil
    const isAuthenticated = ref(false)
    const toastStore = useToastStore()

    const setUserAndProfile = (newUser, newProfile = null) => {
      user.value = newUser
      profile.value = newProfile
      isAuthenticated.value = !!newUser
    }

    const checkAuth = async () => {
      console.log('🔄 Verificando autenticación...')
      const currentUser = await getCurrentUser()
      if (currentUser) {
        // Obtenemos el perfil si el usuario existe
        console.log('✅ Autenticación verificada. El usuario está logueado.')

        const userProfile = await profileService.getAdminProfile(currentUser.id)
        setUserAndProfile(currentUser, userProfile)
      } else {
        console.log('❌ No se encontró token. El usuario no está logueado.')

        setUserAndProfile(null, null)
      }
    }

    // Nuevo método para obtener solo el perfil
    const fetchProfile = async () => {
      if (user.value) {
        const userProfile = await profileService.getAdminProfile(user.value.id)
        profile.value = userProfile
      }
    }

    const login = async (credentials) => {
      try {
        const loggedInUser = await authServiceLogin(credentials)
        // Obtenemos el perfil inmediatamente después del login
        const userProfile = await profileService.getAdminProfile(loggedInUser.id)
        setUserAndProfile(loggedInUser, userProfile)

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
        setUserAndProfile(null, null) // Limpiamos tanto el usuario como el perfil
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
      profile, // Exponemos el estado del perfil
      isAuthenticated,
      setUserAndProfile,
      checkAuth,
      fetchProfile, // Exponemos el nuevo método
      login,
      logout,
    }
  },
  {
    persist: true,
  },
)

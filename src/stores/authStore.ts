// src/stores/authStore.ts//
import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  getCurrentUser,
  login as authServiceLogin,
  logout as authServiceLogout,
} from '@/services/auhtService'
import { useToastStore } from '@/stores/toast'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref(null)
    const isAuthenticated = ref(false)
    const toastStore = useToastStore()

    const setUser = (newUser) => {
      user.value = newUser
      isAuthenticated.value = !!newUser
    }

    const checkAuth = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    }

    const login = async (credentials) => {
      try {
        const loggedInUser = await authServiceLogin(credentials)
        setUser(loggedInUser)
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
        setUser(null)
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
      isAuthenticated,
      setUser,
      checkAuth,
      login,
      logout,
    }
  },
  {
    persist: true,
  },
)

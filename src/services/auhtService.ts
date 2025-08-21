// En src/services/authService.ts
import { useToastStore } from '@/stores/toast'

export const login = async (credentials) => {
  const toastStore = useToastStore()
  try {
    // Lógica de autenticación
    // ...
    toastStore.addToast({
      message: '¡Bienvenido! Has iniciado sesión.',
      type: 'success',
      duration: 5000,
    })
  } catch (error) {
    toastStore.addToast({
      message: 'Error en el login. Por favor, revisa tus credenciales.',
      type: 'error',
    })
  }
}

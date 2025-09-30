//src/composables/useToast.ts
import { useToastStore, type Toast } from '@/stores/toast'

/**
 * Composable para interactuar de forma sencilla con el sistema de toasts.
 * Proporciona métodos para mostrar diferentes tipos de toasts.
 */
export function useToast() {
  const toastStore = useToastStore()

  /**
   * Muestra un toast genérico.
   * @param message - El mensaje que se mostrará en el toast.
   * @param type - El tipo de toast ('success', 'error', upcoming, etc.).
   * @param duration - La duración del toast en milisegundos.
   * @param isClosable - Si el usuario puede cerrar el toast manualmente.
   */
  const showToast = (
    message: string,
    type: Toast['type'] = 'default',
    duration?: number,
    isClosable?: boolean,
  ) => {
    toastStore.addToast({
      message,
      type,
      duration,
      isClosable,
    })
  }

  /**
   * Métodos de conveniencia para tipos de toasts específicos.
   */
  const success = (message: string, duration?: number) => {
    showToast(message, 'success', duration)
  }

  const error = (message: string, duration?: number) => {
    showToast(message, 'error', duration)
  }

  const info = (message: string, duration?: number) => {
    showToast(message, 'info', duration)
  }

  const warning = (message: string, duration?: number) => {
    showToast(message, 'warning', duration)
  }

  // ✅ Añade los nuevos métodos de conveniencia
  const upcoming = (message: string, duration?: number) => {
    showToast(message, 'upcoming', duration)
  }

  const newFeature = (message: string, duration?: number) => {
    showToast(message, 'new-feature', duration)
  }

  return {
    showToast,
    success,
    error,
    info,
    warning,
    // ✅ Exporta los nuevos métodos
    upcoming,
    newFeature,
  }
}

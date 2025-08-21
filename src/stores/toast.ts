//src/stores/toast.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

// --- Definición de Tipos para Toast ---
// Hemos añadido 'id' para identificar cada toast de forma única
// y 'isClosable' para permitir que el usuario lo cierre manualmente.
export interface Toast {
  id: string // Identificador único para cada toast
  message: string
  type: 'success' | 'error' | 'info' | 'warning' | 'default' // Tipos predefinidos para estilos
  duration?: number // Duración opcional en ms. Si no se especifica, usará un valor por defecto.
  isClosable?: boolean // Si el usuario puede cerrar el toast manualmente.
}

// --- Store de Pinia para Toasts ---
export const useToastStore = defineStore('toast', () => {
  // Array que contendrá todos los toasts activos
  const toasts = ref<Toast[]>([])

  // Configuración por defecto para los toasts
  const defaultDuration = 3000 // 3 segundos
  const maxToasts = 5 // Limite de toasts simultáneos para evitar saturar la UI

  /**
   * Añade un nuevo toast a la cola.
   * Genera un ID único y configura su eliminación automática si no es permanente.
   * @param newToast - Objeto Toast con el mensaje, tipo y duración (opcional).
   */
  const addToast = (newToast: Omit<Toast, 'id'>) => {
    // Genera un ID único para el toast usnqado uuid
    const id = uuidv4()

    // Completa el objeto toast con el ID y valores por defecto si no están definidos
    const toast: Toast = {
      id,
      message: newToast.message,
      type: newToast.type || 'default',
      duration: newToast.duration ?? defaultDuration, // Usa la duración del toast o la por defecto
      isClosable: newToast.isClosable ?? true, // Por defecto, los toasts son cerrables
    }

    toasts.value.push(toast)

    // Si el número de toasts excede el límite, elimina el más antiguo
    if (toasts.value.length > maxToasts) {
      toasts.value.shift() // Elimina el toast más antiguo
    }

    // Si el toast tiene una duración definida (no es permanente), programa su eliminación
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        removeToast(id) // Llama a removeToast con el ID específico
      }, toast.duration)
    }
  }

  /**
   * Elimina un toast específico de la cola por su ID.
   * Se usa tanto para la eliminación automática como manual.
   * @param id - El ID del toast a eliminar.
   */
  const removeToast = (id: string) => {
    // Filtra la lista para eliminar el toast con el ID proporcionado
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  /**
   * Limpia toda la lista de toasts.
   */
  const clearToasts = () => {
    toasts.value = []
  }

  return {
    toasts,
    addToast,
    removeToast, // Exportamos removeToast para que pueda ser llamado externamente (ej: por un botón de cerrar)
    clearToasts, //metodod para limpiar la cola de  toast explicitamente
  }
})

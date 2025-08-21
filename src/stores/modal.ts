import { defineStore } from 'pinia'
import { computed, ref, type Component } from 'vue'

// Definimos la interfaz para un modal en la pila
interface Modal {
  name: string
  props?: Record<string, any>
  closeOnClickOutside?: boolean
}

// Store de Pinia para la gestión de modales
export const useModalStore = defineStore('modal', () => {
  // `modalStack` guardará la pila de modales abiertos. El último en el array es el superior.
  const modalStack = ref<Modal[]>([])

  /**
   * Abre un modal y lo añade a la pila.
   * @param name El nombre único del modal a abrir.
   * @param props Opcional: Propiedades que se pasarán al componente del modal.
   * @param closeOnClickOutside Opcional: Si el modal se puede cerrar al hacer clic fuera.
   */
  const openModal = (
    name: string,
    props: Record<string, any> = {},
    closeOnClickOutside: boolean = true,
  ) => {
    // Si ya existe un modal con el mismo nombre, lo eliminamos de la pila
    modalStack.value = modalStack.value.filter((modal) => modal.name !== name)

    // Añadimos el nuevo modal a la pila.
    modalStack.value.push({
      name,
      props,
      closeOnClickOutside,
    })
  }

  /**
   * Cierra el modal superior de la pila.
   */
  const closeModal = () => {
    modalStack.value.pop()
  }

  /**
   * Cierra todos los modales en la pila.
   */
  const closeAllModals = () => {
    modalStack.value = []
  }

  /**
   * Se usa para obtener el modal superior de la pila.
   * Es una propiedad computada que el contenedor usará para renderizar.
   */
  const activeModal = computed(() => {
    return modalStack.value[modalStack.value.length - 1] || null
  })

  return {
    modalStack,
    openModal,
    closeModal,
    closeAllModals,
    activeModal,
  }
})

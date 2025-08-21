import { useModalStore } from '@/stores/modal'
import { storeToRefs } from 'pinia'

/**
 * Composable para interactuar de forma sencilla con el sistema de modales.
 * Proporciona métodos para abrir y cerrar modales desde cualquier componente.
 */
export function useModal() {
  const store = useModalStore()

  // Extraemos la propiedad 'activeModal' del store para que sea reactiva
  // y cualquier componente que use el composable sepa qué modal está abierto.
  const { activeModal } = storeToRefs(store)

  /**
   * Abre un modal específico.
   * @param name - El nombre único del modal a abrir.
   * @param props - Propiedades opcionales para el componente del modal.
   * @param closeOnClickOutside - Opcional: Si el modal se puede cerrar al hacer clic fuera.
   */
  const open = (name: string, props?: Record<string, any>, closeOnClickOutside?: boolean) => {
    store.openModal(name, props, closeOnClickOutside)
  }

  /**
   * Cierra el modal superior de la pila.
   */
  const close = () => {
    store.closeModal()
  }

  return {
    open,
    close,
    activeModal,
  }
}

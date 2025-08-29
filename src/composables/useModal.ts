import { useModalStore } from '@/stores/modal'
import { storeToRefs } from 'pinia'

export function useModal() {
  const store = useModalStore()
  const { activeModal } = storeToRefs(store)

  const open = (name: string, props?: Record<string, any>, closeOnClickOutside?: boolean) => {
    store.openModal(name, props, closeOnClickOutside)
  }

  const close = () => {
    store.closeModal()
  }

  return {
    open,
    close,
    activeModal,
  }
}

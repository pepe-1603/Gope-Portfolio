// src/services/modalService.ts

import { ref, markRaw, type Component } from 'vue'
import type { ActiveModal, ModalOptions, ModalResult, IModalService } from '@/types/modal.d.ts'

const activeModals = ref<Record<number, ActiveModal>>({})
let modalIdCounter = 0

// const currentOfflineModalId = ref<number | null>(null)
// const currentOnlineModalId = ref<number | null>(null)
// const currentBackendDownModalId = ref<number | null>(null)
// const currentBackendUpModalId = ref<number | null>(null)

export function useModalService(): IModalService {
  const hideModal = (id: number, result?: ModalResult) => {
    const modalToHide = activeModals.value[id]

    if (modalToHide) {
      if (!modalToHide._actionResult) {
        modalToHide._actionResult = result || { id: modalToHide.id, action: 'close' }
      }

      console.log(
        'Hiding modal with ID:',
        id,
        'Component name:',
        (modalToHide.component as any).name,
      )
      modalToHide.show = false

      // const componentName = (modalToHide.component as any).name;
      // if (componentName === 'OfflineNotificationModal' && currentOfflineModalId.value === id) {
      //   currentOfflineModalId.value = null;
      // } else if (componentName === 'OnlineReconnectedModal' && currentOnlineModalId.value === id) {
      //   currentOnlineModalId.value = null;
      // } else if (componentName === 'BackendDownModal' && currentBackendDownModalId.value === id) {
      //   currentBackendDownModalId.value = null;
      // } else if (componentName === 'BackendUpModal' && currentBackendUpModalId.value === id) {
      //   currentBackendUpModalId.value = null;
      // }

      setTimeout(() => {
        if (modalToHide._resolver) {
          modalToHide._resolver(modalToHide._actionResult)
          modalToHide._resolver = null
        }
        delete activeModals.value[id]
      }, 300)
    }
  }

  const forceHideModal = (
    id: number,
    action: ModalResult['action'] = 'programmatic_close',
    payload: any = null,
  ) => {
    const modalToHide = activeModals.value[id]
    if (modalToHide) {
      modalToHide._actionResult = { id: id, action, payload }
      hideModal(id)
    }
  }

  const showModal = (
    component: Component,
    props: Record<string, any> = {},
    options: ModalOptions = {},
  ): Promise<ModalResult> => {
    return new Promise((resolve) => {
      // const componentName = (component as any).name;

      // if (componentName === 'OfflineNotificationModal') {
      //   if (currentOfflineModalId.value) { resolve({ id: currentOfflineModalId.value, action: 'duplicate' }); return; }
      //   if (currentOnlineModalId.value) { forceHideModal(currentOnlineModalId.value, 'connection_lost_preempt'); }
      // } else if (componentName === 'OnlineReconnectedModal') {
      //   if (currentOnlineModalId.value) { resolve({ id: currentOnlineModalId.value, action: 'duplicate' }); return; }
      //   if (currentOfflineModalId.value) { forceHideModal(currentOfflineModalId.value, 'connection_restored_preempt'); }
      // }

      modalIdCounter++
      const id = modalIdCounter

      // if (componentName === 'OfflineNotificationModal') { currentOfflineModalId.value = id; }
      // else if (componentName === 'OnlineReconnectedModal') { currentOnlineModalId.value = id; }

      // 🛑 Manejo de error si se pasa un string (ya que tu componente ModalDisplay no maneja strings)
      if (typeof component === 'string') {
        console.error(
          `Modal component name ('${component}') not supported. Must be a Component object.`,
        )
        return Promise.resolve({
          id: -1,
          action: 'cancel',
          payload: 'String component not supported',
        })
      }

      activeModals.value[id] = {
        id,
        // ✅ CORRECCIÓN: TypeScript ahora sabe que 'component' es de tipo Component (objeto).
        component: markRaw(component),
        props: {
          ...props,
          modalId: id,
          __onConfirm: (resultFromModal: any) =>
            hideModal(id, { id, action: 'confirm', payload: resultFromModal }),
          __onCancel: (resultFromModal: any) =>
            hideModal(id, { id, action: 'cancel', payload: resultFromModal }),
          __onClose: (resultFromModal: any) =>
            hideModal(id, { id, action: 'close', payload: resultFromModal }),
        },
        options: { ...options },
        show: true,
        _resolver: resolve,
        _actionResult: null,
      }
    })
  }

  const hideAllModals = () => {
    Object.values(activeModals.value).forEach((modal) => {
      if (!modal._actionResult) {
        modal._actionResult = { id: modal.id, action: 'close_all' }
      }
      hideModal(modal.id, modal._actionResult)
    })
  }

  return {
    activeModals,
    showModal,
    hideModal,
    hideAllModals,
    forceHideModal,
    // currentOfflineModalId,
    // currentOnlineModalId,
    // currentBackendDownModalId,
    // currentBackendUpModalId,
  }
}

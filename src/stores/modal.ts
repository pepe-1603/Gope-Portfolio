import { defineStore } from 'pinia';
import { computed, ref, markRaw } from 'vue';
import type { Component } from 'vue';

// Importa todos tus componentes modales aquí
import LoginModal from '@/components/ui/modals/LoginModal.vue';
import ConfirmDeleteModal from '@/components/ui/modals/ConfirmDeleteModal.vue';
import ConfirmModal from '@/components/ui/modals/ConfirmModal.vue';
import NoInternetModal from '@/components/ui/modals/NoInternetModal.vue';


// ... y cualquier otro que necesites

// Mapea los nombres de los modales a sus componentes
const modalComponents: Record<string, Component> = {
  LoginModal: markRaw(LoginModal),
  ConfirmDeleteModal: markRaw(ConfirmDeleteModal),
  ConfirmModal: markRaw(ConfirmModal),
  NoInternetModal: markRaw(NoInternetModal)
  // ... y otros modales
};

interface ModalState {
  id: number;
  name: string;
  props?: Record<string, any>;
  closeOnClickOutside?: boolean;
  resolve?: (value: any) => void;
  reject?: (reason?: any) => void;
}

export const useModalStore = defineStore('modal', () => {
  const modalStack = ref<ModalState[]>([]);
  let modalIdCounter = 0;

  const openModal = (
    name: string,
    props: Record<string, any> = {},
    closeOnClickOutside: boolean = true,
  ): Promise<any> => {
    // Retorna una promesa para que el router pueda 'esperar'
    return new Promise((resolve, reject) => {
      // Si el modal ya existe en la pila, lo reemplazamos
      const existingIndex = modalStack.value.findIndex((modal) => modal.name === name);
      if (existingIndex !== -1) {
        modalStack.value.splice(existingIndex, 1);
      }

      modalIdCounter++;
      const id = modalIdCounter;

      // Crea el objeto del modal
      const newModal: ModalState = {
        id,
        name,
        props: { ...props, modalId: id },
        closeOnClickOutside,
        resolve,
        reject,
      };

      modalStack.value.push(newModal);
    });
  };

  const closeModal = (id: number, result?: any) => {
    const index = modalStack.value.findIndex((modal) => modal.id === id);
    if (index !== -1) {
      const modalToClose = modalStack.value[index];
      if (modalToClose.resolve) {
        modalToClose.resolve(result);
      }
      modalStack.value.splice(index, 1);
    }
  };

  const activeModal = computed(() => {
    return modalStack.value[modalStack.value.length - 1] || null;
  });

  return {
    // Propiedades de estado
    modalStack,
    activeModal,
    // Componentes registrados
    modalComponents,
    // Acciones y métodos
    openModal,
    closeModal,
  };
}, {
  persist: true,
});

<template>
  <BaseModal
    v-if="activeModal"
    :active="!!activeModal"
    :closeOnClickOutside="activeModal.closeOnClickOutside"
    @close="closeModal"
  >
    <component :is="modalComponents[activeModal.name]" v-bind="activeModal.props" />
  </BaseModal>
</template>

<script setup lang="ts">
import { markRaw } from 'vue'
import { useModalStore } from '@/stores/modal'
import { storeToRefs } from 'pinia'
import BaseModal from './BaseModal.vue'

// 1. Importa todos los componentes de modales que existan en tu aplicación
//    Importamos de forma síncrona para que estén disponibles de inmediato.
import ConfirmDeleteModal from './ConfirmDeleteModal.vue'
import ConfirmResetPasswordModal from './ConfirmResetPasswordModal.vue'
import ConfirmResetPasswordModal2 from './ConfirmResetPasswordModal2.vue'
import LoginModal from './LoginModal.vue'
import ConfirmModal from './ConfirmModal.vue'
import OfflineModal from './OfflineModal.vue' // <-- ¡Nuevo!
import NoInternetModal from './NoInternetModal.vue'

// 2. Mapeamos los nombres de los modales a sus componentes
const modalComponents = {
  LoginModal: markRaw(LoginModal),
  ConfirmDeleteModal: markRaw(ConfirmDeleteModal),
  ConfirmResetPasswordModal: markRaw(ConfirmResetPasswordModal),
  ConfirmResetPasswordModal2: markRaw(ConfirmResetPasswordModal2),
  ConfirmModal: markRaw(ConfirmModal),
  OfflineModal: markRaw(OfflineModal),
  NoInternetModal: markRaw(NoInternetModal), // <-- ¡Nuevo!
}

const store = useModalStore()
const { activeModal } = storeToRefs(store)

// 3. Método para cerrar el modal activo
const closeModal = () => {
  store.closeModal()
}
</script>

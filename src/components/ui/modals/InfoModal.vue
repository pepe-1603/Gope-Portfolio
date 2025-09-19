<template>
  <div class="p-6">
    <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{{ title }}</h3>
    <p class="text-sm text-gray-600 dark:text-gray-300 mb-6">{{ message }}</p>
    <div class="flex justify-end space-x-2">
      <UiButton @click="handleCancel" intent="secondary">
        {{ cancelText }}
      </UiButton>
      <UiButton @click="handleConfirm" intent="primary">
        {{ confirmText }}
      </UiButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import UiButton from '@/components/ui/UiButton.vue'
import type { ModalResult } from '@/types/modal'

export default defineComponent({
  name: 'InfoModal',
  components: {
    UiButton,
  },
  props: {
    title: { type: String, default: 'Confirmación' },
    message: { type: String, default: '¿Estás seguro de que quieres continuar?' },
    confirmText: { type: String, default: 'Aceptar' },
    cancelText: { type: String, default: 'Cancelar' },
    // Propiedades especiales para el modal global
    modalId: { type: Number, required: true },
    __onConfirm: { type: Function as PropType<(result: ModalResult) => void>, required: true },
    __onCancel: { type: Function as PropType<(result: ModalResult) => void>, required: true },
    __onClose: { type: Function as PropType<(result: ModalResult) => void>, required: true },
  },
  methods: {
    handleConfirm() {
      // Usamos el método de prop del modal para confirmar la acción
      this.__onConfirm({ action: 'confirm', payload: null } as ModalResult)
    },
    handleCancel() {
      // Usamos el método de prop del modal para cancelar la acción
      this.__onCancel({ action: 'cancel', payload: null } as ModalResult)
    },
  },
})
</script>

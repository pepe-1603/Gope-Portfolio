<!-- src/components/ui/modals/ConfirmDeleteModal.vue -->
<template>
  <div class="p-4">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Confirmar Eliminación</h2>
    <p class="text-gray-600 dark:text-gray-400 mb-6">
      ¿Estás seguro de que quieres eliminar <strong class="text-blue-500">{{ title }}</strong> con
      el ID <strong class="text-gray-600 dark:text-gray-700">**{{ itemId }}**</strong>? Esta acción
      no se puede deshacer.
    </p>

    <div class="flex justify-end gap-x-2">
      <button
        type="button"
        @click="handleCancel"
        class="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        Cancelar
      </button>
      <button
        type="button"
        @click="handleConfirm"
        class="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
      >
        <UiSpinner v-if="isDeleting" class="ml-2" />
        {{ isDeleting ? 'Eliminando' : 'Eliminar' }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { ModalResult } from '@/types/modal.d.ts' // Asegúrate de que esta ruta sea correcta
import UiSpinner from '../UiSpinner.vue'

export default defineComponent({
  name: 'ConfirmDeleteModal',
  // Props inyectadas por useGlobalModal
  components: { UiSpinner },
  props: {
    modalId: { type: Number, required: true },
    __onConfirm: { type: Function, required: true },
    __onCancel: { type: Function, required: true },
    __onClose: { type: Function, required: true },
    // Prop que pasamos desde la vista para mostrar en el modal
    itemId: { type: [String, Number], required: true },
    title: { type: [String] },
  },
  setup(props) {
    const isDeleting = ref(false)

    const handleConfirm = async () => {
      isDeleting.value = true
      try {
        // Ejecutamos la lógica de confirmación del modal y esperamos a que termine.
        // La vista padre (ProjectManagementView) será la que maneje la llamada al servicio.
        props.__onConfirm({ action: 'confirm', payload: null } as ModalResult)
      } finally {
        isDeleting.value = false
        // El modal se cerrará automáticamente, por lo que no necesitamos llamar a onClose aquí.
      }
    }

    const handleCancel = () => {
      props.__onCancel({ action: 'cancel', payload: null } as ModalResult)
    }

    return {
      isDeleting,
      handleConfirm,
      handleCancel,
    }
  },
})
</script>

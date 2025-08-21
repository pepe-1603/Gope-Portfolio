<template>
  <div class="p-4">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Confirmar Eliminación</h2>
    <p class="text-gray-600 dark:text-gray-400 mb-6">
      ¿Estás seguro de que quieres eliminar el elemento con el ID **{{ itemId }}**? Esta acción no
      se puede deshacer.
    </p>

    <div class="flex justify-end gap-x-2">
      <button
        type="button"
        @click="close"
        class="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        Cancelar
      </button>
      <button
        type="button"
        @click="confirmAction"
        class="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
      >
        Eliminar
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useModal } from '@/composables/useModal'
import { useToastStore } from '@/stores/toast'

export default defineComponent({
  name: 'ConfirmDeleteModal',
  props: {
    // La prop que recibimos al abrir el modal
    itemId: {
      type: [String, Number],
      required: true,
    },
  },
  setup(props) {
    const { close } = useModal()
    const toastStore = useToastStore()

    const confirmAction = () => {
      // Aquí iría tu lógica de eliminación
      // Por ejemplo, una llamada a un servicio
      console.log(`Eliminando el elemento con ID: ${props.itemId}`)

      // Muestra un toast de éxito
      toastStore.addToast({
        message: `Elemento #${props.itemId} eliminado correctamente.`,
        type: 'success',
      })

      // Cierra el modal después de la acción
      close()
    }

    return {
      close,
      confirmAction,
    }
  },
})
</script>

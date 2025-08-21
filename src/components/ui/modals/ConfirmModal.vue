<template>
  <div class="p-4 text-center">
    <h2 class="text-xl font-semibold mb-2">¿Estás seguro?</h2>
    <p class="text-gray-600 dark:text-gray-400 mb-6">
      Esta acción es irreversible. ¿Deseas continuar?
    </p>

    <div class="flex justify-center gap-x-4">
      <button
        type="button"
        @click="cancel"
        class="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
      >
        Cancelar
      </button>
      <button type="button" @click="confirm" class="px-4 py-2 rounded-md bg-red-500 text-white">
        Confirmar
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useModal } from '@/composables/useModal'
import { useToastStore } from '@/stores/toast'

export default defineComponent({
  name: 'ConfirmModal',
  setup() {
    const { close } = useModal()
    const toastStore = useToastStore()

    const confirm = () => {
      // Simplemente cerramos este modal
      close()
      toastStore.addToast({
        message: 'Acción confirmada en el modal secundario.',
        type: 'success',
      })
    }

    const cancel = () => {
      // Cerramos este modal sin realizar la acción
      close()
      toastStore.addToast({
        message: 'Acción cancelada en el modal secundario.',
        type: 'info',
      })
    }

    return {
      confirm,
      cancel,
    }
  },
})
</script>

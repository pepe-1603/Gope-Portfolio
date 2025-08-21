<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col items-end space-y-4">
    <UiToast
      v-for="toast in toasts"
      :key="toast.id"
      :toast="toast"
      @close="handleClose(toast.id)"
    />
  </div>
</template>

<script setup lang="ts">
import UiToast from './UiToast.vue'
import { useToastStore } from '@/stores/toast'
import { storeToRefs } from 'pinia'

// 1. Conectamos el componente al store de Pinia
const store = useToastStore()

store.clearToasts() // Limpia los toasts al cargar el componente en la página inicial

// 2. Extraemos el array de toasts del store para que sea reactivo
const { toasts } = storeToRefs(store)

// 3. Método para manejar el cierre del toast
const handleClose = (id: string) => {
  store.removeToast(id)
}
</script>

<template>
  <div class="p-4 text-center">
    <div class="flex justify-center items-center mb-4">
      <font-awesome-icon :icon="faGlobe" class="w-12 h-12 text-red-500" />
    </div>

    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
      Conectado, pero sin Internet
    </h2>

    <p class="text-gray-600 dark:text-gray-400 mb-4">
      Estás conectado a una red local (Wi-Fi o cable), pero no hay acceso a Internet.<br />
      Esto puede deberse a una caída del proveedor, problemas con el router, o conexión débil.
    </p>

    <UiSpinner message="Intentando reconectar automáticamente..." class="mb-4" />

    <button
      @click="handleRetry"
      class="mt-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
    >
      Reintentar ahora
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import UiSpinner from '@/components/ui/UiSpinner.vue'
import { useModalStore } from '@/stores/modal'

export default defineComponent({
  name: 'NoInternetModal',
  components: { UiSpinner },
  setup() {
    const modalStore = useModalStore()

    const handleRetry = () => {
      // Cerramos y reabrimos para forzar la lógica externa
      modalStore.closeModal()
      setTimeout(() => {
        window.dispatchEvent(new Event('online')) // Forzamos rechecado externo
      }, 100)
    }

    return {
      faGlobe,
      handleRetry,
    }
  },
})
</script>

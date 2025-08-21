<template>
  <div class="p-4 text-center">
    <div class="flex justify-center items-center mb-4">
      <font-awesome-icon :icon="faWifi" class="w-12 h-12 text-red-500" />
    </div>

    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
      Sin Conexión a Internet
    </h2>

    <p class="text-gray-600 dark:text-gray-400 mb-4">
      Tu dispositivo no está conectado a ninguna red. Verifica lo siguiente:
    </p>

    <ul class="text-left text-gray-600 dark:text-gray-400 space-y-2 inline-block">
      <li>
        <font-awesome-icon :icon="faWifi" class="mr-2 text-blue-500" />
        ¿El Wi-Fi está activado?
      </li>
      <li>
        <font-awesome-icon :icon="faEthernet" class="mr-2 text-green-500" />
        ¿El cable de red está bien conectado?
      </li>
      <li>
        <font-awesome-icon :icon="faPlane" class="mr-2 text-yellow-500" />
        ¿Estás en modo avión?
      </li>
    </ul>

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
import { faWifi, faEthernet, faPlane } from '@fortawesome/free-solid-svg-icons'

import { useModalStore } from '@/stores/modal'
import router from '@/router'

export default defineComponent({
  name: 'OfflineModal',
  setup() {
    const modalStore = useModalStore()

    const handleRetry = () => {
      // Cerramos y reabrimos para forzar la lógica externa
      modalStore.closeModal()
      setTimeout(() => {
        router.go(0) //recargar pagina
      }, 3000)
    }

    return {
      handleRetry,
      faWifi,
      faEthernet,
      faPlane,
    }
  },
})
</script>

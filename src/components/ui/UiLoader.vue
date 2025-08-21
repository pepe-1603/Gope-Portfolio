<!-- components/ui/UiLoader.vue -->
<template>
  <div v-if="isLoading" class="loader-container">
    <div class="loader-backdrop"></div>
    <div class="loader-content">
      <svg
        class="animate-spin h-8 w-8 text-gray-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <p class="mt-2 text-gray-500">Cargando...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/uiStore'
import { storeToRefs } from 'pinia'

const uiStore = useUiStore()
const { isLoading } = storeToRefs(uiStore)
</script>

<style scoped>
.loader-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100; /* Asegúrate de que esté por encima de todo */
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7); /* Fondo semi-transparente */
  backdrop-filter: blur(2px);
}

.dark .loader-backdrop {
  background-color: rgba(17, 24, 39, 0.7);
}

.loader-content {
  position: relative;
  z-index: 1; /* Para que el contenido esté por encima del fondo */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>

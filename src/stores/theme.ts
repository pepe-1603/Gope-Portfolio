// src/stores/theme.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore(
  'theme',
  () => {
    const isDarkMode = ref(false)

    // Función para alternar el modo oscuro.
    function toggleDarkMode() {
      isDarkMode.value = !isDarkMode.value
    }

    return {
      isDarkMode,
      toggleDarkMode,
    }
  },
  {
    // Configuración de persistencia para este store
    persist: {
      storage: localStorage,
    },
  },
)

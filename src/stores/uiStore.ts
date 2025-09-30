// src/stores/uiStore.ts (MIGRADO - Setup Store)
import { defineStore } from 'pinia'
// Importamos ref para el estado
import { ref } from 'vue'

// Usa defineStore con la función de setup, similar a <script setup> en un componente
export const useUiStore = defineStore(
  'ui',
  () => {
    // 1. ESTADO (STATE)
    // Usamos ref() para las variables de estado
    const isLoading = ref(false)
    const isGridView = ref(false) // 2. ACCIONES (ACTIONS)
    // ✅ NUEVO ESTADO: Para guardar la preferencia de orden (true = Ascendente A-Z)
    const isAscending = ref(true)
    // Definimos las acciones como funciones normales

    const setLoading = (status: boolean) => {
      isLoading.value = status
    }

    const toggleGridView = () => {
      isGridView.value = !isGridView.value
    }
    // ✅ NUEVA ACCIÓN: Para alternar el ordenamiento
    const toggleSortOrder = () => {
      isAscending.value = !isAscending.value
    }
    // 3. RETORNO
    // Retornamos todo lo que queremos exponer (Estado y Acciones)

    return {
      isLoading,
      isGridView,
      isAscending,
      setLoading,
      toggleGridView,
      toggleSortOrder,
    }
  },
  {
    // 4. PERSISTENCIA
    // La persistencia se define en el segundo argumento de defineStore
    persist: {
      // Dado que ahora usamos el Setup Store, debemos especificar que 'isGridView'
      // es lo que queremos guardar. Pinia sabrá cómo acceder a este ref.
      paths: ['isGridView', 'isAscending'],
    } as any,
  },
)

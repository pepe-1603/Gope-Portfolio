<template>
  <button
    class="w-10 h-10 rounded-full flex items-center justify-center shadow-md bg-white dark:bg-zinc-800 transition duration-500"
    @click="handleToggle"
    :title="tooltipText"
  >
    <font-awesome-icon
      :icon="isDarkMode ? faMoon : faSun"
      class="text-lg text-yellow-400 dark:text-blue-200 transition-transform duration-300 transform"
      :class="{ 'rotate-[360deg]': isDarkMode }"
    />
  </button>
</template>

<script setup lang="ts" name="ThemeSwitch">
import { computed, watchEffect } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { storeToRefs } from 'pinia' // 👈 Importa storeToRefs

library.add(faSun, faMoon)

const themeStore = useThemeStore()
const { isDarkMode } = storeToRefs(themeStore) // 👈 Usa storeToRefs para mantener la reactividad
const { toggleDarkMode } = themeStore // 👈 La función no necesita storeToRefs

function handleToggle() {
  toggleDarkMode()
  if (navigator.vibrate) navigator.vibrate(40)
}

const tooltipText = computed(() =>
  isDarkMode.value ? 'Desactivar modo oscuro' : 'Activar modo oscuro',
)

watchEffect(() => {
  document.documentElement.classList.toggle('dark', isDarkMode.value)
})
</script>

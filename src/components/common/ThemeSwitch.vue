<script setup lang="ts" name="ThemeSwitch">
import { computed, watchEffect } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { storeToRefs } from 'pinia'

library.add(faSun, faMoon)

const themeStore = useThemeStore()
const { isDarkMode } = storeToRefs(themeStore)
const { toggleDarkMode } = themeStore

// ✅ Nueva prop para el tamaño del switch
const props = defineProps({
  size: {
    type: String,
    default: 'md', // Puede ser 'sm' o 'md'
  },
})

function handleToggle() {
  toggleDarkMode()
  if (navigator.vibrate) navigator.vibrate(40)
}

const tooltipText = computed(() =>
  isDarkMode.value ? 'Desactivar modo oscuro' : 'Activar modo oscuro',
)

const sizeClasses = computed(() => ({
  'w-8 h-8': props.size === 'sm',
  'w-10 h-10': props.size === 'md',
}))

watchEffect(() => {
  document.documentElement.classList.toggle('dark', isDarkMode.value)
})
</script>

<template>
  <button
    :class="sizeClasses"
    class="rounded-full flex items-center justify-center shadow-md bg-white dark:bg-zinc-800 transition duration-500"
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

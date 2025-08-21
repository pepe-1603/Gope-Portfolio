<script setup lang="ts" name="ThemeSwitch">
import { computed, watch } from 'vue'
import { useThemeStore } from '@/stores/theme'

const props = defineProps({
  size: {
    type: String,
    default: 'sm',
    validator: (val: string) => ['sm', 'md', 'lg'].includes(val),
  },
})

// Usa el store de Pinia para acceder al estado global del tema
const themeStore = useThemeStore()

// Variable computada que refleja el estado del store
const isDark = computed(() => themeStore.isDarkMode)

// Observa los cambios en el estado del store y actualiza la clase del <html>
watch(
  isDark,
  (val) => {
    document.documentElement.classList.toggle('dark', val)
  },
  { immediate: true },
) // 'immediate' para que se aplique en la carga inicial

// Llama a la acción del store para alternar el tema
function toggleTheme() {
  themeStore.toggleDarkMode()
}

// Clases computadas para el tamaño del interruptor
const sizeClasses = computed(() => {
  const map: { [key: string]: string } = {
    sm: 'scale-90',
    md: 'scale-100',
    lg: 'scale-110',
  }
  return map[props.size] || 'scale-100'
})
</script>

<template>
  <!--Modo {{ isDark ? 'dark' : 'light' }}-->
  <label
    :class="[
      'relative inline-block w-14 h-7 cursor-pointer rounded-full bg-gray-300 transition-colors has-[:checked]:bg-gray-900 dark:bg-gray-700',
      sizeClasses,
      '[-webkit-tap-highlight-color:_transparent]',
    ]"
  >
    <input type="checkbox" class="peer sr-only" :checked="isDark" @change="toggleTheme" />
    <span
      class="absolute inset-y-0 start-0 m-1 size-5 rounded-full bg-gray-300 ring-[6px] ring-inset ring-white transition-all peer-checked:start-8 peer-checked:w-2 peer-checked:bg-white peer-checked:ring-transparent"
    ></span>
  </label>
</template>

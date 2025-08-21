<template>
  <div :class="avatarClasses">
    <img v-if="src" :src="src" :alt="alt" class="object-cover w-full h-full rounded-full" />

    <div
      v-else
      class="flex items-center justify-center w-full h-full bg-gray-300 dark:bg-gray-700 text-white dark:text-gray-200 rounded-full font-medium"
    >
      {{ initials }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, withDefaults } from 'vue'

// 1. DefiniciÃ³n de las Props con TypeScript
interface UiAvatarProps {
  src?: string | null // Fuente de la imagen del avatar (opcional)
  alt?: string // Texto alternativo para la imagen
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' // TamaÃ±os estandarizados
  name?: string // Nombre completo para generar iniciales
}

const props = withDefaults(defineProps<UiAvatarProps>(), {
  src: null,
  alt: 'Avatar de usuario', // DescripciÃ³n mÃ¡s especÃ­fica
  size: 'md', // TamaÃ±o predeterminado
  name: '',
})

// 2. Iniciales del nombre (fallback cuando no hay imagen)
const initials = computed<string>(() => {
  if (props.name) {
    const nameParts = props.name.trim().split(' ')
    if (nameParts.length === 1 && nameParts[0].length > 0) {
      return nameParts[0][0].toUpperCase() // Primera letra del nombre
    } else if (nameParts.length > 1 && nameParts[0].length > 0 && nameParts[1].length > 0) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase() // Primera letra del nombre y del Ãºltimo apellido
    }
  }
  return 'U' // Si no hay nombre o es invÃ¡lido, usar una "U" por defecto
})

// 3. Clases de Tailwind para el tamaÃ±o y estilo del avatar
const avatarClasses = computed<string>(() => {
  const sizeMap = {
    xs: 'w-6 h-6 text-xs', // 24px
    sm: 'w-8 h-8 text-sm', // 32px
    md: 'w-12 h-12 text-base', // 48px
    lg: 'w-16 h-16 text-lg', // 64px
    xl: 'w-24 h-24 text-xl', // 96px
  }

  const selectedSizeClasses = sizeMap[props.size] || sizeMap.md // Fallback a 'md' si el tamaÃ±o no es vÃ¡lido

  return `${selectedSizeClasses} rounded-full flex-shrink-0` // AÃ±adir flex-shrink-0 para evitar que se encoja en flex containers
})
</script>

<style scoped>
/* Estilos adicionales si es necesario (generalmente no se necesita mucho con Tailwind) */
</style>

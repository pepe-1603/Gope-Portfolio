<template>
  <div class="relative flex items-center w-full my-4">
    <!-- LÃ­nea del divisor -->
    <div class="flex-grow border-t border-gray-300 dark:border-gray-600"></div>

    <!-- Contenedor para el icono o etiqueta -->
    <div v-if="label" class="mx-4 text-sm font-medium text-gray-600 dark:text-gray-300">
      {{ label }}
    </div>

    <div v-if="icon" class="mx-4">
      <Icon class="w-5 h-5 text-gray-600 dark:text-gray-300" />
    </div>

    <!-- LÃ­nea del divisor -->
    <div class="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
  </div>
</template>

<script lang="ts" setup>
// Propiedades del componente
const props = defineProps({
  label: {
    type: String,
    default: null,
  },
  icon: {
    type: [Object, Function],
    default: null,
  },
  color: {
    type: String,
    default: 'gray',
    validator(value: string) {
      return ['gray', 'red', 'yellow', 'green', 'blue', 'indigo', 'purple', 'pink'].includes(value)
    },
  },
  size: {
    type: String,
    default: 'sm',
    validator(value: string) {
      return ['sm', 'lg'].includes(value)
    },
  },
})

// Asignar el icono
const Icon = props.icon
</script>

<style scoped>
/* Estilos adicionales si es necesario */
</style>

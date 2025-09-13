<script setup lang="ts" generic="T">
import UiAlert from './UiAlert.vue'

defineProps<{
  items: T[] | null
  loading: boolean
  hasError: boolean
  emptyMessage: string
  // ✅ NUEVA PROP para la vista
  isGrid?: boolean
}>()
</script>

<template>
  <div>
    <div v-if="loading">
      <slot name="loading" />
    </div>

    <div v-else-if="hasError" class="p-4">
      <UiAlert intent="danger" :dismissible="false">
        <slot name="error-message">
          No se pudieron cargar los datos. Por favor, inténtalo de nuevo más tarde.
        </slot>
      </UiAlert>
    </div>

    <div
      v-else-if="!items || items.length === 0"
      class="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow"
    >
      <p class="text-gray-500 dark:text-gray-400">
        {{ emptyMessage }}
      </p>
    </div>

    <div v-else class="space-y-4">
      <slot name="default" :items="items" :is-grid="isGrid" />
    </div>
  </div>
</template>

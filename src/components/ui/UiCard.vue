<template>
  <div
    class="rounded-lg bg-white dark:bg-gray-800 dark:text-gray-200 shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    :class="props.fullWidth ? 'w-full' : 'w-fit'"
  >
    <div v-if="$slots.header" class="p-6 pb-0">
      <slot name="header"></slot>
    </div>

    <div class="p-6">
      <slot></slot>
    </div>

    <div v-if="$slots.footer" class="p-6 pt-0 flex justify-end gap-2">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// No se necesitan cambios aquí.
const props = withDefaults(
  defineProps<{
    fullWidth?: boolean
  }>(),
  {
    fullWidth: false,
  },
)
</script>

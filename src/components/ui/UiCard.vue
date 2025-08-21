<template>
  <div class="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 dark:text-gray-200">
    <div v-if="$slots.header" class="mb-4">
      <slot name="header"></slot>
    </div>

    <div>
      <slot></slot>
    </div>

    <div v-if="$slots.footer" class="mt-6 flex justify-end gap-2">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// El componente UiCard no necesita props, es estructural.
// Solo usa slots para acomodar el contenido.
</script>

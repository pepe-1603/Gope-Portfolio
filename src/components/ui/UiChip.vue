<template>
  <button
    type="button"
    :class="[
      'px-3 py-1 text-sm font-medium rounded-full transition-colors duration-200 ease-in-out',
      active
        ? 'bg-blue-600 text-white'
        : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
    ]"
  >
    {{ text }}
  </button>
</template>

<script setup lang="ts" name="UiChip">
defineProps<{
  text: string;
  active: boolean;
}>();
</script>

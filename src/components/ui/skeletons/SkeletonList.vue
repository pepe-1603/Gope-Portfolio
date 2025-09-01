<!-- src/components/ui/skeletons/SkeletonList.vue -->
<template>
  <div class="space-y-4">
    <div v-for="i in count" :key="i" class="p-4 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md animate-pulse h-12">
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps({
  count: {
    type: Number,
    default: 5,
  },
});
</script>

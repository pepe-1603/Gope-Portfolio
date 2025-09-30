<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
    <div
      v-for="i in count"
      :key="i"
      class="relative rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 h-32 md:h-40 lg:h-48 animate-pulse"
    >
      <div class="bg-gray-200 dark:bg-gray-700 w-full h-full flex items-center justify-center">
        <div
          class="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full text-base flex items-center justify-center"
        >
          <FontAwesomeIcon icon="fas fa-file-archive" class="text-current" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFileArchive } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { defineProps } from 'vue'

library.add(faFileArchive)

defineProps({
  count: {
    type: Number,
    default: 10, // Un default más alto para llenar la cuadrícula
  },
})
</script>

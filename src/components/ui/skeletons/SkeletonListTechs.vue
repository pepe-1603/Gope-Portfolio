<!-- src/components/ui/skeletons/SkeletonListTechs.vue -->
<template>
  <ul role="list" class="divide-y divide-gray-100 dark:divide-gray-800 p-4 lg:p-6 rounded-md">
      <li v-for="i in count" :key="i" class="flex justify-between gap-x-6 py-4 shadow-smrounded-sm">
        <div class="flex min-w-0 gap-x-4 hover:cursor-text">
          <div class="size-16 flex-none rounded-full  bg-gray-200 dark:bg-gray-700  animate-pulse"></div>
          <div class="min-w-0 flex-auto">
            <div class=" flex items-center text-sm/6 font-semibold text-gray-900"><h4 class="h-6 w-64 lg:w-72 bg-gray-200 dark:bg-gray-700  rounded-md animate-pulse"></h4> </div>
            <div class="flex flex-col md:flex-row gap-2 items-start  mt-2 truncate text-xs/5 text-gray-500">
              <p class="w-72 h-4 bg-gray-200 dark:bg-gray-700  rounded-md animate-pulse"></p>
            </div>
          </div>
        </div>
        <div class="flex gap-4 items-center">
          <div class="shrink-0 sm:flex sm:flex-col sm:items-end">
            <div class="w-12 h-6 bg-gray-200 dark:bg-gray-700  rounded-3xl animate-pulse hover:cursor-pointer"></div>
          </div>
        </div>
      </li>
      <li class="mx-auto  mt-6 h-8 w-auto md:w-9/12 self-center rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse hover:cursor-pointer">
      </li>
  </ul>
</template>

<script setup lang="ts">

defineProps({
  count: {
    type: Number,
    default: 5,
  },
});
</script>

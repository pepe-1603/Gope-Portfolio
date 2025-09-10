<!-- src/components/ui/skeletons/SkeletonListExperience.vue -->
<template>
  <ul role="list" class="divide-y divide-gray-100 dark:divide-gray-800 p-4 lg:p-6 rounded-md">
    <li v-for="i in count" :key="i" class="flex justify-between gap-x-6 py-4 shadow-sm rounded-sm">
      <div class="flex min-w-0 gap-x-4 hover:cursor-text">
        <div class="w-full sm:min-w-[464px] flex-auto">
          <div class="flex items-center text-sm/6 font-semibold text-gray-900">
            <div
              class="size-9 flex-none rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"
            ></div>
            <h4
              class="ml-2 h-5 w-64 lg:w-72 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"
            ></h4>
          </div>
          <div
            class="flex flex-col md:flex-row gap-2 items-start mt-2 truncate text-xs/5 text-gray-500"
          >
            <p class="min-w-full h-6 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></p>
            <p class="w-72 h-6 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></p>
          </div>
        </div>
      </div>
      <div class="flex gap-4 items-start">
        <div
          class="w-8 h-5 bg-gray-200/65 dark:bg-gray-800/65 rounded-md animate-pulse hover:cursor-text"
        ></div>
      </div>
    </li>
    <li
      class="hidden shrink-0 sm:block mx-auto mt-6 h-8 w-auto md:w-9/12 self-center rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse hover:cursor-pointer"
    ></li>
  </ul>
</template>

<script setup lang="ts">
defineProps({
  count: {
    type: Number,
    default: 5,
  },
})
</script>

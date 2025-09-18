<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 animate-pulse grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
  >
    <div class="md:col-span-1 flex flex-col items-center text-center">
      <div class="w-32 h-32 sm:w-40 sm:h-40 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      <div class="mt-4 w-3/4 h-6 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
      <div class="mt-2 w-1/2 h-4 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
      <div class="mt-4 w-full h-12 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
    </div>

    <div class="md:col-span-2">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div class="w-1/3 h-6 bg-gray-200 dark:bg-gray-700 rounded-md mb-2 sm:mb-0"></div>
        <div class="w-24 h-8 bg-blue-200 dark:bg-blue-700 rounded-md"></div>
      </div>

      <dl class="space-y-4">
        <div v-for="i in 4" :key="i">
          <dt class="w-1/4 h-4 bg-gray-200 dark:bg-gray-700 rounded-md"></dt>
          <dd class="mt-1 w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded-md"></dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<template>
  <div class="flex flex-col min-h-screen">
    <header class="bg-white dark:bg-gray-800 shadow-md">
      <nav class="container mx-auto p-4 flex justify-between items-center">
        <router-link to="/" class="text-2xl font-bold dark:text-white">Mi Portafolio</router-link>
        <div class="flex items-center space-x-4">
          <SettingsDropdown />
        </div>
      </nav>
    </header>
    <main class="flex-grow w-full mx-auto p-6 flex items-center justify-center max-w-lg">
      <RouterView />
    </main>
    <footer
      class="bg-gray-100 dark:bg-gray-800 p-6 text-center text-gray-600 dark:text-gray-400 mt-auto"
    >
      <p>&copy; {{ new Date().getFullYear() }} José. Todos los derechos reservados.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import SettingsDropdown from '@/components/common/SettingsDropdown.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <header class="bg-white dark:bg-gray-800 shadow-md">
      <nav class="container mx-auto p-4 flex justify-between items-center">
        <router-link to="/" class="text-2xl font-bold dark:text-white">Mi Portafolio</router-link>
        <div class="flex items-center space-x-4">
          <router-link
            to="/proyectos"
            class="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
            >Proyectos</router-link
          >
          <router-link
            to="/sobre-mi"
            class="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
            >Sobre Mí</router-link
          >
          <span>
            <ThemeSwitch size="sm" />
          </span>
        </div>
      </nav>
    </header>

    <main class="flex-grow container mx-auto p-6">
      <RouterView />
    </main>

    <footer
      class="bg-gray-100 dark:bg-gray-800 p-6 text-center text-gray-600 dark:text-gray-400 mt-auto"
    >
      <p>&copy; {{ new Date().getFullYear() }} José. Todos los derechos reservados.</p>
    </footer>
  </div>
</template>

<script setup>
import ThemeSwitch from '@/components/common/ThemeSwitch.vue'
import { RouterView } from 'vue-router'

// No necesitas script si solo contiene HTML/CSS
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <header class="bg-white dark:bg-gray-800 shadow-md">
      <nav class="container mx-auto p-4 flex justify-between items-center">
        <router-link to="/" class="text-2xl font-bold dark:text-white">Mi Portafolio</router-link>

        <div class="hidden md:flex items-center space-x-4">
          <PublicNavMenu />
        </div>

        <div class="md:hidden flex items-center">
          <SettingsDropdown class="mr-4" />
          <button @click="toggleMobileMenu" class="text-gray-700 dark:text-gray-300 text-xl">
            <font-awesome-icon :icon="['fas', 'bars']" />
          </button>
        </div>
      </nav>
    </header>

    <main class="flex-grow max-w-full overflow-y-auto overflow-x-hidden mx-auto p-6">
      <RouterView />
    </main>

    <footer
      class="bg-gray-100 dark:bg-gray-800 p-6 text-center text-gray-600 dark:text-gray-400 mt-auto"
    >
      <p>&copy; {{ new Date().getFullYear() }} José. Todos los derechos reservados.</p>
    </footer>

    <div
      v-if="isMobileMenuOpen"
      class="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
      @click="toggleMobileMenu"
    >
      <div
        class="fixed right-0 top-0 h-full w-64 bg-white dark:bg-gray-800 p-6 shadow-xl transform transition-transform duration-300 ease-in-out"
        :class="isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'"
        @click.stop
      >
        <div class="flex justify-end mb-4">
          <button @click="toggleMobileMenu" class="text-gray-700 dark:text-gray-300 text-2xl">
            <font-awesome-icon :icon="['fas', 'times']" />
          </button>
        </div>
        <PublicNavMenu class="flex flex-col space-y-4" @click="toggleMobileMenu" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import SettingsDropdown from '@/components/common/SettingsDropdown.vue'
import PublicNavMenu from '@/components/layout/PublicNavMenu.vue'

library.add(faBars, faTimes)

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

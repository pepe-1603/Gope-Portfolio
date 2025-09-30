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

<script setup lang="ts" name="BaseLayout">
import { onMounted, onUnmounted, ref } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import SettingsDropdown from '@/components/common/SettingsDropdown.vue'
import PublicNavMenu from '@/components/layout/PublicNavMenu.vue'
import { useAuthStore } from '@/stores/authStore'

library.add(faBars, faTimes)

const isMobileMenuOpen = ref(false)
const router = useRouter()
const authStore = useAuthStore()

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const handleAdminAccess = () => {
  // 1. Si no está logueado, vamos directamente al login. (UX Rápida)
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  // 2. Si está logueado, pero no es admin, redirigimos a home. (UX Discreta)
  // Asumiendo que el rol requerido es 'admin'
  if (authStore.profile?.role !== 'admin') {
    router.push('/')
    return
  }

  // 3. ¡Es Admin y Logueado! Redirigimos al panel.
  router.push('/admin')
}

const handleAdminHotkey = (event: KeyboardEvent) => {
  // Tecla 'A' y Modificadores:
  // Windows: CtrlKey + AltKey + A
  // Mac: MetaKey (Cmd) + AltKey + A
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
  const isWindows = !isMac

  const modifierKey = isMac ? event.metaKey : event.ctrlKey

  if (event.key.toUpperCase() === 'A' && event.altKey && modifierKey) {
    console.log('Atajo de teclado de administrador detectado.')
    handleAdminAccess() // ✅ Usar la función que contiene la lógica de seguridad
    event.preventDefault() // Detiene cualquier acción por defecto (como guardar)
  }
}

onMounted(() => {
  // Añadir el listener al montar el componente (al iniciar la aplicación)
  window.addEventListener('keydown', handleAdminHotkey)
})

onUnmounted(() => {
  // Quitar el listener al destruir el componente
  window.removeEventListener('keydown', handleAdminHotkey)
})
</script>

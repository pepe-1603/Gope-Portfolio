<template>
  <div class="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <aside
      class="w-64 bg-white dark:bg-gray-800 shadow-lg p-6 flex-col hidden md:flex fixed top-0 left-0 h-full z-20"
    >
      <div class="text-2xl font-bold mb-8 text-indigo-600 dark:text-indigo-400">Admin Panel</div>
      <AdminNavMenu />
      <button
        type="button"
        @click="handleLogout"
        class="mt-auto px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
      >
        <font-awesome-icon icon="fa-solid fa-right-from-bracket" class="mr-2" />
        Cerrar Sesión
      </button>
    </aside>

    <div class="flex-grow md:ml-64">
      <header
        class="md:hidden sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-md p-4 flex items-center justify-between"
      >
        <h1 class="text-xl font-bold text-indigo-600 dark:text-indigo-400">Admin</h1>
        <button @click="toggleMobileMenu">
          <font-awesome-icon
            :icon="['fas', 'bars']"
            class="text-gray-600 dark:text-gray-300 text-xl"
          />
        </button>
      </header>

      <main class="flex-grow p-6 overflow-y-auto max-w-full overflow-x-hidden mx-auto">
        <RouterView />
      </main>
    </div>

    <div
      v-if="isMobileMenuOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
      @click="toggleMobileMenu"
    >
      <div
        class="fixed top-0 left-0 w-64 h-full bg-white dark:bg-gray-800 shadow-lg p-6 transition-transform transform duration-300 ease-in-out"
        :class="isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'"
        @click.stop
      >
        <div class="flex justify-between items-center mb-8">
          <div class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Admin Panel</div>
          <button @click="toggleMobileMenu">
            <font-awesome-icon
              :icon="['fas', 'times']"
              class="text-gray-600 dark:text-gray-300 text-xl"
            />
          </button>
        </div>
        <AdminNavMenu />
        <div class="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            @click="handleLogoutAndCloseMenu"
            class="w-full px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            <font-awesome-icon icon="fa-solid fa-right-from-bracket" class="mr-2" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars, faTimes, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { useAuthStore } from '@/stores/authStore'
import { useGlobalModal } from '@/composables/useGlobalModal'
import ConfirmLogoutModal from '@/components/ui/modals/ConfirmLogoutModal.vue'
import AdminNavMenu from '@/components/layout/AdminNavMenu.vue'

library.add(faBars, faTimes, faRightFromBracket)

const router = useRouter()
const authStore = useAuthStore()
const modal = useGlobalModal()

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const handleLogout = async () => {
  const result = await modal.showModal(
    ConfirmLogoutModal,
    {},
    {
      closeOnClickOutside: false,
    },
  )

  if (result?.action === 'confirm') {
    await authStore.logout()
    router.push({ name: 'home' })
  }
}

const handleLogoutAndCloseMenu = async () => {
  await handleLogout()
  isMobileMenuOpen.value = false
}
</script>

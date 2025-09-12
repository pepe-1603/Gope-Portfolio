<template>
  <div class="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <aside class="w-64 bg-white dark:bg-gray-800 shadow-lg p-6 flex flex-col">
      <div class="text-2xl font-bold mb-8 text-indigo-600 dark:text-indigo-400">Admin Panel</div>
      <nav class="flex-grow">
        <ul class="space-y-2">
          <li>
            <router-link
              to="/admin"
              class="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              active-class="bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-200"
            >
              <font-awesome-icon icon="fa-solid fa-gauge-high" />
              <span>Dashboard</span>
            </router-link>
          </li>
          <li>
            <router-link
              to="/admin/projects"
              class="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              active-class="bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-200"
            >
              <font-awesome-icon icon="fa-solid fa-list-check" />
              <span>Proyectos</span>
            </router-link>
          </li>
          <li>
            <router-link
              to="/admin/technologies"
              class="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              active-class="bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-200"
            >
              <font-awesome-icon icon="fa-solid fa-microchip" />
              <span>Tecnologías</span>
            </router-link>
          </li>
          <li>
            <router-link
              to="/admin/experience"
              class="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              active-class="bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-200"
            >
              <font-awesome-icon icon="fa-solid fa-briefcase" />
              <span>Experiencia</span>
            </router-link>
          </li>
          <li>
            <router-link
              to="/admin/storage"
              class="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              active-class="bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-200"
            >
              <font-awesome-icon icon="fa-solid fa-bucket" />
              <span>Almacenamiento</span>
            </router-link>
          </li>
          <li class="border-t border-gray-200 dark:border-gray-700 my-4 pt-4"></li>
          <li>
            <router-link
              to="/admin/profile"
              class="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              active-class="bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-200"
            >
              <font-awesome-icon icon="fa-solid fa-user-cog" />
              <span>Mi Perfil</span>
            </router-link>
          </li>
        </ul>
      </nav>
      <button
        type="button"
        @click="handleLogout"
        class="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
      >
        <font-awesome-icon icon="fa-solid fa-right-from-bracket" class="mr-2" />
        Cerrar Sesión
      </button>
    </aside>

    <main class="flex-grow p-6 overflow-y-auto">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faGaugeHigh,
  faListCheck,
  faMicrochip,
  faRightFromBracket,
  faBucket,
  faUserCog,
  faBriefcase, // Importamos el ícono de experiencia
} from '@fortawesome/free-solid-svg-icons'
import { useAuthStore } from '@/stores/authStore'
import { useGlobalModal } from '@/composables/useGlobalModal'
import ConfirmLogoutModal from '@/components/ui/modals/ConfirmLogoutModal.vue'

library.add(
  faGaugeHigh,
  faListCheck,
  faMicrochip,
  faRightFromBracket,
  faUserCog,
  faBucket,
  faBriefcase,
)

const router = useRouter()
const authStore = useAuthStore()
const modal = useGlobalModal()

const handleLogout = async () => {
  const result = await modal.showModal(
    ConfirmLogoutModal,
    {},
    {
      closeOnClickOutside: false,
    }
  )

  if (result?.action === 'confirm') {
    await authStore.logout()
    router.push({ name: 'home' })
  }
}
</script>

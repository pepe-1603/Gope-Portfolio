<template>
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
      <li>
        <router-link
          to="/admin/settings"
          class="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          active-class="bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-200"
        >
          <font-awesome-icon icon="fa-solid fa-cogs" />
          <span>Configuración</span>
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
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faGaugeHigh,
  faListCheck,
  faMicrochip,
  faBucket,
  faUserCog,
  faBriefcase,
  faCogs,
} from '@fortawesome/free-solid-svg-icons'

library.add(faGaugeHigh, faListCheck, faMicrochip, faBucket, faUserCog, faBriefcase, faCogs)
</script>

<template>
  <div class="p-6 space-y-8">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
      Panel de Control (Dashboard)
    </h1>

    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="i in 4"
        :key="i"
        class="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow animate-pulse h-32"
      ></div>
    </div>
    <div v-else-if="hasError">
      <UiAlert
        intent="danger"
        title="Error de Carga"
        description="No se pudieron cargar las estadísticas. Revisa la conexión con el servicio."
      />
    </div>

    <div v-else class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <UiCard class="bg-blue-600 dark:bg-blue-700 text-white" full-width>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium opacity-90">Proyectos</h3>
            <FontAwesomeIcon icon="fa-solid fa-folder-open" class="text-2xl opacity-70" />
          </div>
          <p class="text-4xl font-extrabold mt-3">{{ stats.projects }}</p>
          <p class="mt-2 text-sm opacity-90">Total gestionado.</p>
        </UiCard>

        <UiCard class="bg-green-600 dark:bg-green-700 text-white" full-width>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium opacity-90">Tecnologías</h3>
            <FontAwesomeIcon icon="fa-solid fa-microchip" class="text-2xl opacity-70" />
          </div>
          <p class="text-4xl font-extrabold mt-3">{{ stats.technologies }}</p>
          <p class="mt-2 text-sm opacity-90">Registradas en el sistema.</p>
        </UiCard>

        <UiCard class="bg-yellow-600 dark:bg-yellow-700 text-white" full-width>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium opacity-90">Experiencia</h3>
            <FontAwesomeIcon icon="fa-solid fa-briefcase" class="text-2xl opacity-70" />
          </div>
          <p class="text-4xl font-extrabold mt-3">{{ stats.experience }}</p>
          <p class="mt-2 text-sm opacity-90">Entradas en el CV.</p>
        </UiCard>

        <UiCard class="bg-gray-700 dark:bg-gray-600 text-white" full-width>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium opacity-90">Almacenamiento</h3>
            <FontAwesomeIcon icon="fa-solid fa-database" class="text-2xl opacity-70" />
          </div>
          <p class="text-4xl font-extrabold mt-3">
            {{ formatBytes(stats.storageUsageBytes) }}
          </p>
          <p class="mt-2 text-sm opacity-90">Espacio total de archivos.</p>
        </UiCard>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <UiCard
          class="lg:col-span-8 bg-white dark:bg-gray-800 shadow-lg p-6 min-h-[450px]"
          full-width
        >
          <h2 class="text-xl font-semibold dark:text-gray-100 mb-4">
            Distribución de Proyectos por Tecnología
          </h2>
          <p class="text-gray-500 dark:text-gray-400">Placeholder para gráfica.</p>
        </UiCard>

        <div class="lg:col-span-4 flex flex-col gap-6">
          <UiCard class="bg-indigo-500 dark:bg-indigo-600 text-white" full-width>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium opacity-90">Último Proyecto</h3>
              <FontAwesomeIcon icon="fa-solid fa-clock-rotate-left" class="text-2xl opacity-70" />
            </div>

            <p v-if="stats.latestProject" class="mt-3">
              <span class="text-sm opacity-90">Título:</span>
              <span
                class="block text-xl font-extrabold truncate hover:underline cursor-pointer"
                @click="goToProjectPreview(stats.latestProject.id)"
              >
                {{ stats.latestProject.title }}
              </span>
            </p>
            <p v-else class="text-xl font-semibold mt-3">Sin actividad reciente.</p>

            <p v-if="stats.latestProject" class="mt-2 text-xs opacity-80">
              Actualizado: {{ formatDate(stats.latestProject.updated_at) }}
            </p>
          </UiCard>

          <UiCard class="bg-white dark:bg-gray-800 shadow-lg p-6 flex-grow" full-width>
            <h2 class="text-xl font-semibold dark:text-gray-200 mb-3">Accesos Directos</h2>
            <ul class="space-y-2 text-md">
              <li
                class="p-2 -mx-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition duration-150"
              >
                <router-link
                  :to="{ name: 'admin-projects' }"
                  class="text-blue-500 dark:text-blue-400 hover:text-blue-600"
                  >Gestión de Proyectos
                  <FontAwesomeIcon icon="fas fa-arrow-up-right-from-square" class="text-xs" />
                </router-link>
              </li>
              <li
                class="p-2 -mx-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition duration-150"
              >
                <router-link
                  :to="{ name: 'admin-techs' }"
                  class="text-blue-500 dark:text-blue-400 hover:text-blue-600"
                  >Gestión de Tecnologías
                  <FontAwesomeIcon icon="fas fa-arrow-up-right-from-square" class="text-xs"
                /></router-link>
              </li>
              <li
                class="p-2 -mx-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition duration-150"
              >
                <router-link
                  :to="{ name: 'admin-storage' }"
                  class="text-blue-500 dark:text-blue-400 hover:text-blue-600"
                >
                  Gestión de Archivos
                  <FontAwesomeIcon icon="fas fa-arrow-up-right-from-square" class="text-xs"
                /></router-link>
              </li>
            </ul>
          </UiCard>
        </div>
      </div>

      <UiCard class="bg-white dark:bg-gray-800 shadow-lg p-6 min-h-[250px]">
        <h2 class="text-xl font-semibold dark:text-gray-100 mb-4">Log de Actividad Reciente</h2>

        <div v-if="activityLoading" class="flex justify-center items-center min-h-[150px]">
          <UiSpinner size="lg" />
        </div>

        <div v-else-if="activityLog.length > 0" class="space-y-4">
          <div
            v-for="activity in activityLog"
            :key="activity.id"
            class="flex items-start justify-between border-b dark:border-gray-700 pb-2 last:border-b-0 last:pb-0"
          >
            <div class="flex flex-col">
              <p class="text-sm font-medium dark:text-gray-200">
                {{ activity.description }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                <span class="capitalize">{{ activity.resource_type }}</span> por
                {{ activity.user_email }}
              </p>
            </div>
            <div class="flex-shrink-0 text-right">
              <UiBadge
                :color="getActivityBadgeIntent(activity.action)"
                size="xs"
                :text="activity.action"
                class="text-xs uppercase"
              >
                {{ activity.action }}
              </UiBadge>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ formatDate(activity.created_at) }}
              </p>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-6 text-gray-500 dark:text-gray-400">
          <FontAwesomeIcon icon="fa-solid fa-list-check" class="text-2xl mb-2" />
          <p>No se encontró actividad reciente en el log.</p>
        </div>
      </UiCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { statsService } from '@/services/statsService'
import UiCard from '@/components/ui/UiCard.vue'
import UiAlert from '@/components/ui/UiAlert.vue'
// ✅ IMPORTACIÓN DE AMBAS FUNCIONES DE FORMATO
import { formatDate, formatBytes } from '@/utils/formatters'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faFolderOpen,
  faMicrochip,
  faBriefcase,
  faClockRotateLeft,
  faDatabase,
  faArrowUpRightFromSquare, // ✅ Nuevo ícono para Almacenamiento
} from '@fortawesome/free-solid-svg-icons'
import type { AdminActivity } from '@/types/activity'
import { activityService } from '@/services/activityService'
import UiSpinner from '@/components/ui/UiSpinner.vue'
import UiBadge from '@/components/ui/UiBadge.vue'

// ✅ Añadimos el nuevo ícono a la librería
library.add(
  faFolderOpen,
  faMicrochip,
  faBriefcase,
  faClockRotateLeft,
  faDatabase,
  faArrowUpRightFromSquare,
)

const router = useRouter()

// Definición de tipos para las estadísticas
interface DashboardStats {
  projects: number
  technologies: number
  experience: number
  latestProject: { id: string; title: string; updated_at: string } | null
  // ✅ Incluimos el nuevo tipo
  storageUsageBytes: number
}

const stats = ref<DashboardStats | null>(null)
const loading = ref(true)
const hasError = ref(false)

// ✅ NUEVO ESTADO PARA EL LOG DE ACTIVIDAD
const activityLog = ref<AdminActivity[]>([])
const activityLoading = ref(true)

const fetchStats = async () => {
  loading.value = true
  hasError.value = false
  try {
    stats.value = (await statsService.getDashboardStats()) as DashboardStats
  } catch (e) {
    hasError.value = true
    stats.value = null
    console.error('Failed to load dashboard stats:', e)
  } finally {
    loading.value = false
  }
}

const goToProjectPreview = (projectId: string) => {
  router.push({ name: 'admin-project-preview', params: { id: projectId } })
}

// ✅ NUEVA FUNCIÓN PARA CARGAR EL LOG
const fetchActivityLog = async () => {
  activityLoading.value = true
  try {
    activityLog.value = await activityService.getRecentActivity(5) // Obtener las últimas 5 acciones
    console.log('Data activity: ', activityLog.value)
  } catch (e) {
    console.error('Failed to load activity log:', e)
  } finally {
    activityLoading.value = false
  }
}
// Función para obtener el color del badge basado en la acción (Estética UX)
const getActivityBadgeIntent = (action: string) => {
  switch (action) {
    case 'CREATE':
      return 'green'
    case 'DELETE':
      return 'red'
    case 'UPDATE':
      return 'orange'
    default:
      return 'blue'
  }
}

onMounted(() => {
  fetchStats()
  fetchActivityLog()
})
</script>

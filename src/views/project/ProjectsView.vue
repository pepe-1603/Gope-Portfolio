<template>
  <div class="py-12">
    <h1 class="text-3xl font-bold text-center mb-8 dark:text-white">Mis Proyectos</h1>

    <div v-if="isLoadingInitial" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ProjectCardSkeleton v-for="n in 6" :key="n" />
    </div>

    <div v-else-if="error" class="text-center text-red-500">
      <UiAlert
        intent="danger"
        class="text-left"
        title="Error al cargar los proyectos."
        :description="error"
        dismissible
      >
        <span @click="fetchProjects" class="underline hover:cursor-pointer">Reintentar</span>
      </UiAlert>
    </div>

    <div
      v-else-if="projects && projects.length === 0"
      class="flex flex-col items-center text-center py-20 text-gray-500 dark:text-gray-400"
    >
      <font-awesome-icon :icon="faFaceFrown" class="w-14 h-14 mb-4 text-current" />
      <h2 class="text-2xl font-semibold mb-2">¡Ups! No hay proyectos disponibles.</h2>
      <p>Parece que aún no hay proyectos publicados. Vuelve pronto para ver las novedades.</p>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="project in projects" :key="project.id">
          <ProjectCard :project="project" />
        </div>
      </div>

      <InfiniteScrollSentinel @intersect="loadMoreProjects" />

      <div v-if="isLoadingMore" class="flex justify-center my-8">
        <UiLoader />
      </div>

      <p v-if="!hasMoreProjects && projects && projects.length > 0" class="text-center text-gray-500 mt-8">
        No hay más proyectos para mostrar.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { projectService } from '@/services/projectService'
import UiAlert from '@/components/ui/UiAlert.vue'
import ProjectCard from '@/components/project/ProjectCard.vue'
import ProjectCardSkeleton from '@/components/ui/skeletons/ProjectCardSkeleton.vue'
import InfiniteScrollSentinel from '@/components/common/InfiniteScrollSentinel.vue'
import UiLoader from '@/components/ui/UiLoader.vue'
import { faFaceFrown } from '@fortawesome/free-solid-svg-icons'
import type { Tables } from '@/types/supabase' // <-- Importamos el tipo 'Tables'

// Tipado de las referencias reactivas
const projects = ref<Tables<'projects'>[] | null>([])
const isLoadingInitial = ref(true)
const isLoadingMore = ref(false)
const error = ref<string | null>(null)
const page = ref(1)
const projectsPerPage = 6
const hasMoreProjects = ref(true)

const fetchProjects = async (pageNumber = 1) => {
  error.value = null
  const currentProjects = projects.value || [] // Para evitar `null` en `projects.value`

  if (pageNumber === 1) {
    isLoadingInitial.value = true
    projects.value = null // Limpiar el estado de proyectos en la carga inicial
  } else {
    isLoadingMore.value = true
  }

  try {
    const fetchedProjects = await projectService.getProjectsByPage(
      pageNumber,
      projectsPerPage
    )

    if (fetchedProjects === null || fetchedProjects.length === 0) {
      hasMoreProjects.value = false
      if (pageNumber === 1) {
        projects.value = [] // Si no hay proyectos, inicializamos a un array vacío
      }
    } else {
      projects.value = [...currentProjects, ...fetchedProjects]
    }
  } catch (err: any) {
    console.error('Error fetching projects:', err)
    error.value = 'No se pudieron cargar los proyectos. Por favor, verifica tu conexión.'
  } finally {
    if (pageNumber === 1) {
      setTimeout(() => {
        isLoadingInitial.value = false
      }, 500)
    } else {
      isLoadingMore.value = false
    }
  }
}

const loadMoreProjects = async () => {
  if (!hasMoreProjects.value || isLoadingMore.value) {
    return
  }
  page.value++
  await fetchProjects(page.value)
}

onMounted(async () => {
  await fetchProjects()
})
</script>

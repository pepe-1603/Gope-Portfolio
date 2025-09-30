<template>
  <div class="px-6 py-12">
    <h1 class="text-3xl font-bold text-center mb-8 dark:text-white">Mis Proyectos</h1>

    <div v-if="isLoadingInitial" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ProjectCardSkeleton v-for="n in projectsPerPage" :key="n" />
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
        <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
      </div>

      <InfiniteScrollSentinel v-if="hasMoreProjects" @intersect="loadMoreProjects" />

      <div v-if="isLoadingMore" class="flex justify-center my-8">
        <UiSpinner message="cargando..." />
      </div>

      <p
        v-if="!hasMoreProjects && projects && projects.length > 0 && !isLoadingMore"
        class="text-center text-gray-500 mt-8"
      >
        No hay más proyectos para mostrar.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { projectService } from '@/services/projectService'
import UiAlert from '@/components/ui/UiAlert.vue'
import ProjectCard from '@/components/project/ProjectCard.vue'
import ProjectCardSkeleton from '@/components/ui/skeletons/ProjectCardSkeleton.vue'
import InfiniteScrollSentinel from '@/components/common/InfiniteScrollSentinel.vue'
import UiSpinner from '@/components/ui/UiSpinner.vue'
import { faFaceFrown } from '@fortawesome/free-solid-svg-icons'
import type { ProjectWithTechs } from '@/types/project'

const projects = ref<ProjectWithTechs[] | null>([])
const isLoadingInitial = ref(true)
const isLoadingMore = ref(false)
const error = ref<string | null>(null)
const page = ref(0)
const projectsPerPage = 6
const totalProjectsCount = ref(0)

const hasMoreProjects = computed(() => {
  if (!projects.value) return false
  return projects.value.length < totalProjectsCount.value
})

const fetchProjects = async (isLoadMore = false) => {
  error.value = null
  if (!isLoadMore) {
    isLoadingInitial.value = true
    projects.value = []
    page.value = 0
    totalProjectsCount.value = 0
  } else {
    isLoadingMore.value = true
  }
  try {
    const { data, count } = await projectService.getPaginatedProjects(page.value, projectsPerPage)
    if (data) {
      const projectsWithTechs: ProjectWithTechs[] = data.map((project: any) => ({
        ...project,
        project_techs: project.project_techs || [],
      }))
      projects.value = [...(projects.value || []), ...projectsWithTechs]
    }
    totalProjectsCount.value = count || 0
  } catch (err: any) {
    console.error('Error fetching projects:', err)
    error.value = 'No se pudieron cargar los proyectos. Por favor, verifica tu conexión.'
  } finally {
    isLoadingInitial.value = false
    isLoadingMore.value = false
  }
}

const loadMoreProjects = () => {
  if (!hasMoreProjects.value || isLoadingMore.value || isLoadingInitial.value) {
    return
  }
  page.value++
  fetchProjects(true)
}

onMounted(() => {
  fetchProjects()
})
</script>

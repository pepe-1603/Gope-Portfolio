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
      v-else-if="projects.length === 0"
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

      <p v-if="!hasMoreProjects && projects.length > 0" class="text-center text-gray-500 mt-8">
        No hay más proyectos para mostrar.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUiStore } from '@/stores/uiStore'
import { projectService } from '@/services/projectService.js'
import UiAlert from '@/components/ui/UiAlert.vue'
import ProjectCard from '@/components/project/ProjectCard.vue'
import ProjectCardSkeleton from '@/components/ui/skeletons/ProjectCardSkeleton.vue'
import InfiniteScrollSentinel from '@/components/common/InfiniteScrollSentinel.vue'
import UiLoader from '@/components/ui/UiLoader.vue'
// Archivo donde deseas probar la conexión
import supabase from '@/lib/supabaseClient'
import { faFaceFrown } from '@fortawesome/free-solid-svg-icons'

async function testSupabaseConnection() {
  const { data, error } = await supabase.from('projects').select('*')

  if (error) {
    console.error('Error connecting to Supabase:', error)
  } else {
    console.log('Data from Supabase:', data)
  }
}

testSupabaseConnection()

const projects = ref([])
const isLoadingInitial = ref(true) // Carga inicial
const isLoadingMore = ref(false) // Carga de más elementos
const error = ref(null)
const page = ref(1)
const projectsPerPage = 6 // Define cuántos proyectos cargar por lote
const hasMoreProjects = ref(true)

const fetchProjects = async (pageNumber = 1) => {
  error.value = null

  if (pageNumber === 1) {
    isLoadingInitial.value = true
  } else {
    isLoadingMore.value = true
  }

  try {
    const fetchedProjects = await projectService.getProjectsByPage(pageNumber, projectsPerPage)

    if (fetchedProjects.length === 0) {
      hasMoreProjects.value = false
    } else {
      projects.value = projects.value.concat(fetchedProjects)
    }
  } catch (err) {
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
  // No cargar más si ya se llegó al final o si ya hay una carga en progreso
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

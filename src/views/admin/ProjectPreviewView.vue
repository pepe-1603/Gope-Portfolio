<!--src/view/admin/ProjectPreviewView.vue-->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { projectService } from '@/services/projectService.ts'
import UiBadge from '@/components/ui/UiBadge.vue'
import ProjectDetailSkeleton from '@/components/ui/skeletons/ProjectDetailSkeleton.vue'
import { faGlobe, faLink } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { getTechColor } from '@/utils/badgeStyles'
import UiCollapsible from '@/components/ui/UiCollapsible.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import type { ProjectWithTechs } from '@/types/project'
import UiAlert from '@/components/ui/UiAlert.vue'

// Añade el nuevo ícono a la biblioteca
library.add(faGithub, faLink, faGlobe)

const route = useRoute()
const errorFetch = ref<string | null>(null)
const project = ref<ProjectWithTechs | null>(null)

onMounted(async () => {
  try {
    const projectId = route.params.id as string

    // Si la ruta no tiene un ID, mostramos un error
    if (!projectId) {
      errorFetch.value = 'ID de proyecto no proporcionado.'
      return
    }

    const fetchedProject = await projectService.getProjectById(projectId)

    if (fetchedProject) {
      project.value = fetchedProject
    } else {
      errorFetch.value = 'Tecnología no encontrada.'
    }
  } catch (err) {
    console.error('Error cargando proyecto:', err)
    errorFetch.value = 'No se pudo cargar el proyecto o no tienes permisos.'
    project.value = null
  }
})
</script>

<template>
  <div class="p-6">
    <div v-if="errorFetch" class="mt-8 container mx-auto p-6">
      <UiAlert intent="danger" title="Error" :description="errorFetch" dismissible />
    </div>

    <section v-else-if="project" class="max-w-4xl mx-auto px-6 py-12">
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {{ project.title }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400 font-semibold mb-4">
          {{ project.summary }}
        </p>
        <div class="flex justify-center gap-4 mt-4">
          <a
            v-if="project.live_url"
            :href="project.live_url"
            target="_blank"
            class="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
          >
            <font-awesome-icon :icon="['fas', 'globe']" /> Ver Proyecto
          </a>
          <a
            v-if="project.repo_url"
            :href="project.repo_url"
            target="_blank"
            class="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
          >
            <font-awesome-icon :icon="['fab', 'github']" /> Repositorio
          </a>
        </div>
      </div>

      <img
        v-if="project.image_url"
        :src="project.image_url"
        :alt="project.title"
        class="w-full min-h-64 max-h-96 object-cover rounded-lg mb-8 shadow-lg"
      />

      <div class="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-inner">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Detalles del Proyecto
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 dark:text-gray-300">
          <p>
            <strong class="font-medium text-gray-800 dark:text-gray-100">Estado:</strong>
            <UiBadge
              class="ml-2"
              :color="project.is_published ? 'green' : 'orange'"
              size="sm"
              :text="project.is_published ? 'Público' : 'Privado'"
            />
          </p>
          <div class="flex flex-col sm:flex-row items-start justify-start">
            <p>
              <strong class="font-medium text-gray-800 dark:text-gray-100">Creado en:</strong>
              {{ new Date(project.created_at).toLocaleDateString() }}
            </p>
            <p v-if="project.updated_at != project.created_at">
              <strong class="font-medium text-gray-800 dark:text-gray-100"
                >Última actualización:</strong
              >
              {{ new Date(project.updated_at).toLocaleDateString() }}
            </p>
          </div>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-2 pb-2">
          Descripción del Proyecto
        </h2>

        <UiCollapsible title="Leer descripción completa" class="my-6">
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {{ project.description }}
          </p>
        </UiCollapsible>
      </div>

      <div class="mb-8">
        <h2
          class="text-2xl font-semibold text-gray-800 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2"
        >
          Tecnologías utilizadas
        </h2>
        <div class="flex flex-wrap gap-2">
          <UiBadge
            v-for="techData in project.project_techs"
            :key="techData.techs.id"
            :text="techData.techs.name"
            :color="getTechColor(techData.techs.name)"
            :icon="techData.techs.icon_url"
          />
        </div>
      </div>
    </section>

    <ProjectDetailSkeleton v-else />
  </div>
</template>

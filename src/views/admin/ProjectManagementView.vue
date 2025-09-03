<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalModal } from '@/composables/useGlobalModal'
import { useToastStore } from '@/stores/toast'
import { projectService } from '@/services/projectService.ts' // Importación del servicio tipado
import UiButton from '@/components/ui/UiButton.vue'
import UiAlert from '@/components/ui/UiAlert.vue'
import SkeletonList from '@/components/ui/skeletons/SkeletonList.vue'
import ConfirmDeleteModal from '@/components/ui/modals/ConfirmDeleteModal.vue'
import type { Tables } from '@/types/supabase' // Importamos el tipo de la tabla 'projects'

const router = useRouter()
const modal = useGlobalModal()
const toastStore = useToastStore()

// Tipamos la referencia reactiva para 'projects'
const projects = ref<Tables<'projects'>[] | null>(null)
const loading = ref(true)
const hasError = ref(false)

const fetchProjects = async () => {
  try {
    loading.value = true
    hasError.value = false
    // La función getAllProjects ya devuelve el tipo correcto
    projects.value = await projectService.getAllProjects()
  } catch (error) {
    hasError.value = true
    projects.value = null // Aseguramos que el valor sea null en caso de error
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProjects()
})

const handleCreateProject = () => {
  router.push({ name: 'project-create' })
}

const handleEditProject = (slug: string) => {
  router.push({ name: 'project-edit', params: { slug } })
}

const handleDeleteProject = async (id: string, title: string) => {
  const result = await modal.showModal(
    ConfirmDeleteModal,
    { itemId: id, title },
    {
      title: 'Confirmar Eliminación',
      closeOnClickOutside: false,
    },
  )

  if (result?.action === 'confirm') {
    try {
      await projectService.deleteProject(id)
      await fetchProjects()
      toastStore.addToast({
        message: 'Proyecto eliminado con éxito.',
        type: 'success',
      })
    } catch (error) {
      toastStore.addToast({
        message: 'Error al eliminar el proyecto. Por favor, revisa tus permisos.',
        type: 'error',
      })
    }
  }
}
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold dark:text-gray-100">Gestión de Proyectos</h2>
      <UiButton @click="handleCreateProject" intent="primary">
        Crear Nuevo Proyecto
      </UiButton>
    </div>

    <div v-if="loading">
      <SkeletonList :count="5" />
    </div>

    <div v-else-if="hasError" class="p-4">
      <UiAlert intent="danger">
        No se pudieron cargar los proyectos. Por favor, inténtalo de nuevo más tarde.
      </UiAlert>
    </div>

    <div
      v-else-if="projects && projects.length === 0"
      class="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow"
    >
      <p class="text-gray-500 dark:text-gray-400">No hay proyectos para mostrar.</p>
    </div>

    <div v-else-if="projects" class="space-y-4">
      <div
        v-for="project in projects"
        :key="project.id"
        class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md flex justify-between items-center"
      >

      <div class="flex gap-4">
        <img
          :src="project.image_url || 'https://via.placeholder.com/150'"
          alt="Imagen project"
          class="w-28 h-28 rounded-xl object-cover shadow-lg"
        />
        <div class="block space-y-1">
          <p class="font-semibold text-blue-600 dark:text-blue-700">{{ project.title }}</p>
          <p class="font-semibold text-sm md:text-base text-gray-900 dark:text-white">{{ project.summary }}</p>
        </div>
      </div>
        <div class="flex space-x-2">
          <UiButton @click="handleEditProject(project.slug)" intent="link">
            Editar
          </UiButton>
          <UiButton @click="handleDeleteProject(project.id, project.title)" intent="danger">
            Eliminar
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>

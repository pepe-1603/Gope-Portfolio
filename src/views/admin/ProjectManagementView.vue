// src/views/admin/ProjectManagementView.vue
<script setup lang="ts" name="ProjectManagementView">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalModal } from '@/composables/useGlobalModal'
import { useToastStore } from '@/stores/toast'
import { projectService } from '@/services/projectService'
import UiButton from '@/components/ui/UiButton.vue'
import SkeletonListProjects from '@/components/ui/skeletons/SkeletonListProjects.vue'
import AdminList from '@/components/ui/AdminList.vue'
import ProjectListItem from '@/components/admin/ProjectListItem.vue'
import ConfirmDeleteModal from '@/components/ui/modals/ConfirmDeleteModal.vue'
import ProjectFormModal from '@/components/ui/modals/ProjectFormModal.vue'
import type { Tables } from '@/types/supabase'
import type { ModalResult } from '@/types/modal'
import CreateProjectModal from '@/components/ui/modals/CreateProjectModal.vue'

const router = useRouter()
const modal = useGlobalModal()
const toastStore = useToastStore()

const projects = ref<Tables<'projects'>[] | null>(null)
const loading = ref(true)
const hasError = ref(false)

const fetchProjects = async () => {
  try {
    loading.value = true
    hasError.value = false
    projects.value = await projectService.getAllProjects()
    console.log('Poryects List en Supabase ', projects.value)
  } catch (error) {
    hasError.value = true
    projects.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProjects()
})

const handleCreateProject = async () => {
  const result: ModalResult | null = await modal.showModal(CreateProjectModal, {}, {})
  if (result?.action === 'confirm') {
    await fetchProjects()
    toastStore.addToast({ message: 'Proyecto creado con éxito.', type: 'success' })
  } else if (result?.action === 'cancel') {
    toastStore.addToast({ message: 'Creación de proyecto cancelada.', type: 'info' })
  }
}

const handleEditProject = async (slug: string) => {
  try {
    // 1. Usa el servicio para obtener el proyecto con las tecnologías
    const projectToEdit = await projectService.getProjectBySlug(slug)

    // Añadimos un log para ver la data recibida
    console.log('Datos del proyecto a editar (con techs):', projectToEdit)

    if (!projectToEdit) {
      toastStore.addToast({ message: 'Proyecto no encontrado.', type: 'error' })
      return
    }

    // 2. Ahora, pasa este objeto completo al modal
    const result = await modal.showModal(
      ProjectFormModal,
      { projectData: projectToEdit },
      {
        /*title: `Editar: ${projectToEdit.title}` */
      },
    )
    if (result?.action === 'confirm') {
      await fetchProjects()
      toastStore.addToast({ message: 'Proyecto actualizado con éxito.', type: 'success' })
    } else if (result?.action === 'cancel') {
      toastStore.addToast({ message: 'Edición de proyecto cancelada.', type: 'info' })
    }
  } catch (error) {
    console.error('Error en handleEditProject:', error)
    toastStore.addToast({ message: 'Error al abrir el formulario de edición.', type: 'error' })
  }
}

const handlePreviewProject = (id: string) => {
  const url = router.resolve({ name: 'admin-project-preview', params: { id } }).href
  window.open(url, '_blank')
}

const handleDeleteProject = async (id: string, title: string) => {
  const result = await modal.showModal(
    ConfirmDeleteModal,
    { itemId: id, title },
    {
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
      <UiButton @click="handleCreateProject" intent="primary"> Crear Nuevo Proyecto </UiButton>
    </div>

    <AdminList
      :items="projects"
      :loading="loading"
      :has-error="hasError"
      empty-message="No hay proyectos para mostrar."
    >
      <template #loading>
        <SkeletonListProjects />
      </template>

      <template #error-message>
        No se pudieron cargar los proyectos. Por favor, inténtalo de nuevo más tarde.
      </template>

      <template #default="{ items }">
        <ul role="list" class="space-y-4 divide-y divide-gray-100 dark:divide-gray-800">
          <ProjectListItem
            v-for="project in items"
            :key="project.id"
            :project="project"
            @preview="handlePreviewProject(project.id)"
            @edit="handleEditProject(project.slug)"
            @delete="handleDeleteProject(project.id, project.title)"
          />
        </ul>
      </template>
    </AdminList>
  </div>
</template>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold dark:text-gray-100">Gestión de Proyectos</h2>
      <div class="flex space-x-2 items-center">
        <UiButton
          @click="toggleViewMode"
          intent="secondary"
          size="md"
          :aria-label="`Cambiar a vista de ${isGridView ? 'lista' : 'mosaico'}`"
        >
          <FontAwesomeIcon :icon="isGridView ? 'fa-solid fa-list' : 'fa-solid fa-grip'" />
        </UiButton>
        <UiButton
          @click="toggleSortOrder"
          intent="secondary"
          size="md"
          :aria-label="`Ordenar de forma ${isAscending ? 'descendente' : 'ascendente'}`"
        >
          <FontAwesomeIcon
            :icon="isAscending ? 'fa-solid fa-arrow-down-a-z' : 'fa-solid fa-arrow-up-a-z'"
          />
        </UiButton>
        <UiButton @click="handleCreateProject" intent="primary">
          <FontAwesomeIcon icon="fa-solid fa-plus" class="mr-2" /> Crear Nuevo
        </UiButton>
      </div>
    </div>

    <AdminList
      :items="sortedProjects"
      :loading="loading"
      :has-error="hasError"
      empty-message="No hay proyectos para mostrar."
      :is-grid="isGridView"
    >
      <template #loading>
        <SkeletonListProjects v-if="!isGridView" />
        <div v-else>Cargando vista de mosaico...</div>
      </template>

      <template #error-message>
        No se pudieron cargar los proyectos. Por favor, inténtalo de nuevo más tarde.
      </template>

      <template #default="{ items }">
        <transition-group
          name="fade"
          tag="ul"
          :class="{
            'divide-y divide-gray-100 dark:divide-gray-800 gap-2': !isGridView,
            'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4': isGridView,
          }"
        >
          <ProjectListItem
            v-for="project in items"
            :key="project.id"
            :project="project"
            @preview="handlePreviewProject(project)"
            @edit="handleEditProject(project.slug)"
            @delete="handleDeleteProject(project.id, project.title)"
            :is-grid-item="isGridView"
          />
        </transition-group>
      </template>
    </AdminList>
  </div>
</template>

<script setup lang="ts" name="ProjectManagementView">
import { ref, onMounted, computed } from 'vue'
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
import CreateProjectModal from '@/components/ui/modals/CreateProjectModal.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faList,
  faGrip,
  faPlus,
  faArrowDownAZ,
  faArrowUpAZ,
} from '@fortawesome/free-solid-svg-icons'
import type { Tables } from '@/types/supabase'
import type { ModalResult } from '@/types/modal'
import type { ProjectWithTechs } from '@/types/project'

library.add(faList, faGrip, faArrowDownAZ, faArrowUpAZ, faPlus)

const router = useRouter()
const modal = useGlobalModal()
const toastStore = useToastStore()

const projects = ref<Tables<'projects'>[] | null>(null)
const loading = ref(true)
const hasError = ref(false)

// ✅ NUEVAS VARIABLES DE ESTADO
const isGridView = ref(false)
const isAscending = ref(true)

const toggleViewMode = () => {
  isGridView.value = !isGridView.value
}

const toggleSortOrder = () => {
  isAscending.value = !isAscending.value
}

// ✅ COMPUTADA PARA ORDENAR LOS DATOS
const sortedProjects = computed(() => {
  if (!projects.value) return []
  return [...projects.value].sort((a, b) => {
    const titleA = a.title.toLowerCase()
    const titleB = b.title.toLowerCase()
    if (titleA < titleB) return isAscending.value ? -1 : 1
    if (titleA > titleB) return isAscending.value ? 1 : -1
    return 0
  })
})

const fetchProjects = async () => {
  try {
    loading.value = true
    hasError.value = false
    projects.value = await projectService.getAllProjects()
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
    const projectToEdit = (await projectService.getProjectBySlug(slug)) as
      | ProjectWithTechs
      | undefined
    if (!projectToEdit) {
      toastStore.addToast({ message: 'Proyecto no encontrado.', type: 'error' })
      return
    }
    const result = await modal.showModal(ProjectFormModal, { projectData: projectToEdit }, {})
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

const handlePreviewProject = (project: Tables<'projects'>) => {
  const url = router.resolve({ name: 'admin-project-preview', params: { id: project.id } }).href
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

<style scoped>
/* Transiciones para la vista de proyectos */
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translateZ(0);
}

.fade-leave-active {
  position: absolute;
}
</style>

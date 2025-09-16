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
        <UiAlert
          intent="danger"
          title="Error"
          description="No se pudieron cargar los proyectos. Por favor, inténtalo de nuevo más tarde."
        />
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
    <div v-if="hasMoreProjects" class="mt-6 text-center">
      <UiButton intent="secondary" full-width @click="loadMoreProjects" :disabled="loadingMore">
        <UiSpinner v-if="loadingMore" message="cargando..." />
        <span v-else>Ver más proyectos</span>
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts" name="ProjectManagementView">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalModal } from '@/composables/useGlobalModal'
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
import { useToast } from '@/composables/useToast'
import UiAlert from '@/components/ui/UiAlert.vue'
import UiSpinner from '@/components/ui/UiSpinner.vue'

library.add(faList, faGrip, faArrowDownAZ, faArrowUpAZ, faPlus)

const router = useRouter()
const modal = useGlobalModal()
const toast = useToast()

const projects = ref<Tables<'projects'>[] | null>(null)
const loading = ref(true)
const hasError = ref(false)

// ✅ AÑADIDO: Variables de estado para la paginación
const currentPage = ref(0)
const limit = 10 // O el número de elementos que desees por página
const totalProjects = ref(0)
const loadingMore = ref(false)

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

// ✅ AÑADIDO: Nueva función para cargar los proyectos
const fetchProjects = async (isLoadMore = false) => {
  try {
    if (!isLoadMore) {
      loading.value = true
      projects.value = []
      currentPage.value = 0
    } else {
      loadingMore.value = true
    }
    hasError.value = false

    // ✅ CORRECCIÓN: Usar la nueva función de servicio y el conteo
    const { data, count } = await projectService.getAllProjects(currentPage.value, limit)
    totalProjects.value = count || 0

    if (isLoadMore) {
      projects.value = projects.value ? [...projects.value, ...(data || [])] : data
    } else {
      projects.value = data
    }
  } catch (error) {
    hasError.value = true
    projects.value = null
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

// ✅ AÑADIDO: Función para cargar la siguiente página
const hasMoreProjects = computed(() => {
  if (!projects.value || totalProjects.value === null) return false
  return projects.value.length < totalProjects.value
})

// ✅ AÑADIDO: Función para cargar la siguiente página
const loadMoreProjects = () => {
  currentPage.value++
  fetchProjects(true)
}

onMounted(() => {
  fetchProjects()
})

const handleCreateProject = async () => {
  const result: ModalResult | null = await modal.showModal(CreateProjectModal, {}, {})
  if (result?.action === 'confirm') {
    await fetchProjects()
    toast.success('Proyecto creado con éxito.')
  } else if (result?.action === 'cancel') {
    toast.info('Creación de proyecto cancelada.')
  }
}

const handleEditProject = async (slug: string) => {
  try {
    const projectToEdit = (await projectService.getProjectBySlug(slug)) as
      | ProjectWithTechs
      | undefined
    if (!projectToEdit) {
      toast.error('Proyecto no encontrado.')
      return
    }
    const result = await modal.showModal(ProjectFormModal, { projectData: projectToEdit }, {})
    if (result?.action === 'confirm') {
      await fetchProjects()
      toast.success('Proyecto actualizado con éxito.')
    } else if (result?.action === 'cancel') {
      toast.info('Edición de proyecto cancelada.')
    }
  } catch (error) {
    console.error('Error en handleEditProject:', error)
    toast.error('Error al abrir el formulario de edición.')
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
      toast.success('Proyecto eliminado con éxito.')
      // ✅ CORRECCIÓN: Volvemos a cargar los proyectos desde cero para reflejar la eliminación
      await fetchProjects()
    } catch (error) {
      toast.error('Error al eliminar el proyecto. Por favor, revisa tus permisos.')
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

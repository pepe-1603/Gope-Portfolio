<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold dark:text-gray-100">Gestión de Tecnologías</h2>
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
          <FontAwesomeIcon :icon="isAscending ? 'fa-arrow-down-a-z' : 'fa-arrow-up-a-z'" />
        </UiButton>
        <UiButton @click="handleCreateTech" intent="primary">
          <FontAwesomeIcon icon="fa-solid fa-plus" class="mr-2" />Crear Nueva
        </UiButton>
      </div>
    </div>

    <AdminList
      :items="sortedTechs"
      :loading="loading"
      :has-error="hasError"
      empty-message="No hay tecnologías para mostrar."
      :is-grid="isGridView"
    >
      <template #loading>
        <SkeletonListTechs v-if="!isGridView" />
        <div v-else>Cargando vista de mosaico...</div>
      </template>

      <template #default="{ items }">
        <transition-group
          name="fade"
          tag="ul"
          :class="{
            'divide-y divide-gray-100 dark:divide-gray-800 gap-2': !isGridView,
            'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4': isGridView,
          }"
        >
          <TechListItem
            v-for="tech in items"
            :key="tech.id"
            :tech="tech"
            :tech-description="`ID: ${tech.id}`"
            @view="handleViewTech(tech)"
            @edit="handleEditTech(tech)"
            @delete="handleDeleteTech(tech.id, tech.name)"
            :is-grid-item="isGridView"
          />
        </transition-group>
      </template>
    </AdminList>
    <div v-if="hasMoreTechs" class="mt-6 text-center">
      <UiButton intent="secondary" full-width @click="loadMoreTechs" :disabled="loadingMore">
        <UiSpinner v-if="loadingMore" message="Cargando..." />
        <span v-else>Ver más tecnologías</span>
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts" name="TechManagementView">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { techService } from '@/services/techService'
import { useGlobalModal } from '@/composables/useGlobalModal'
import { useToastStore } from '@/stores/toast'
import UiButton from '@/components/ui/UiButton.vue'
import SkeletonListTechs from '@/components/ui/skeletons/SkeletonListTechs.vue'
import AdminList from '@/components/ui/AdminList.vue'
import TechListItem from '@/components/admin/TechListItem.vue'
import ConfirmDeleteModal from '@/components/ui/modals/ConfirmDeleteModal.vue'
import CreateTechModal from '@/components/ui/modals/CreateTechModal.vue'
import TechFormModal from '@/components/ui/modals/TechFormModal.vue'
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
import UiSpinner from '@/components/ui/UiSpinner.vue'

library.add(faList, faGrip, faArrowDownAZ, faArrowUpAZ, faPlus)

const router = useRouter()
const modal = useGlobalModal()
const toastStore = useToastStore()

const techs = ref<Tables<'techs'>[] | null>(null)
const loading = ref(true)
const loadingMore = ref(false)
const hasError = ref(false)
const currentPage = ref(0)
const limit = 10
const totalTechs = ref(0)

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
const sortedTechs = computed(() => {
  if (!techs.value) return []
  return [...techs.value].sort((a, b) => {
    const nameA = a.name.toLowerCase()
    const nameB = b.name.toLowerCase()
    if (nameA < nameB) return isAscending.value ? -1 : 1
    if (nameA > nameB) return isAscending.value ? 1 : -1
    return 0
  })
})

const fetchTechs = async (isLoadMore = false) => {
  try {
    if (!isLoadMore) {
      loading.value = true
      techs.value = null
      currentPage.value = 0
    } else {
      loadingMore.value = true
    }
    hasError.value = false

    const { data, count } = await techService.getPaginatedTechs(currentPage.value, limit)
    totalTechs.value = count || 0

    if (isLoadMore) {
      techs.value = techs.value ? [...techs.value, ...(data || [])] : data
    } else {
      techs.value = data
    }
  } catch (error) {
    hasError.value = true
    techs.value = null
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const hasMoreTechs = computed(() => {
  if (!techs.value || totalTechs.value === null) return false
  return techs.value.length < totalTechs.value
})

onMounted(() => {
  fetchTechs()
})

const handleViewTech = (tech: Tables<'techs'>) => {
  router.push({ name: 'admin-tech-preview', params: { id: tech.id } })
}

const loadMoreTechs = () => {
  currentPage.value++
  fetchTechs(true)
}

const handleCreateTech = async () => {
  const result = await modal.showModal(CreateTechModal, {}, { title: 'Crear Nueva Tecnología' })
  if (result?.action === 'confirm') {
    await fetchTechs()
    toastStore.addToast({ message: 'Tecnología creada con éxito.', type: 'success' })
  }
}

const handleEditTech = async (tech: Tables<'techs'>) => {
  try {
    const result = await modal.showModal(TechFormModal, { tech }, {})
    if (result?.action === 'confirm') {
      await fetchTechs()
      toastStore.addToast({ message: 'Tecnología actualizada con éxito.', type: 'success' })
    } else if (result?.action === 'cancel') {
      toastStore.addToast({ message: 'Edición de proyecto cancelada.', type: 'info' })
    }
  } catch (error) {
    console.error('Error al obtener la tecnología para editar:', error)
    toastStore.addToast({ message: 'No se pudo cargar la tecnología para editar.', type: 'error' })
  }
}

const handleDeleteTech = async (techId: string, techName: string) => {
  const result = await modal.showModal(
    ConfirmDeleteModal,
    { itemId: techId, title: techName },
    { closeOnClickOutside: false },
  )
  if (result?.action === 'confirm') {
    try {
      await techService.deleteTech(techId)
      await fetchTechs()
      toastStore.addToast({ message: 'Tecnología eliminada con éxito.', type: 'success' })
    } catch (error) {
      toastStore.addToast({ message: 'Error al eliminar la tecnología.', type: 'error' })
    }
  }
}
</script>

<style scoped>
/* 3. Transiciones */
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

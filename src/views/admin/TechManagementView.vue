<script setup lang="ts" name="TechManagementView">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { techService } from '@/services/techService'
import { useGlobalModal } from '@/composables/useGlobalModal'
import { useToastStore } from '@/stores/toast'
import UiButton from '@/components/ui/UiButton.vue'
import SkeletonListTechs from '@/components/ui/skeletons/SkeletonListTechs.vue' // Asegúrate de tener este componente
import AdminList from '@/components/ui/AdminList.vue' // Importa el nuevo componente genérico
import TechListItem from '@/components/admin/TechListItem.vue' // Importa el nuevo ítem de tecnología
import ConfirmDeleteModal from '@/components/ui/modals/ConfirmDeleteModal.vue'
import type { Tables } from '@/types/supabase'
import CreateTechModal from '@/components/ui/modals/CreateTechModal.vue'
import TechFormModal from '@/components/ui/modals/TechFormModal.vue'

const router = useRouter()
const modal = useGlobalModal()
const toastStore = useToastStore()

const techs = ref<Tables<'techs'>[] | null>(null)
const loading = ref(true)
const loadingMore = ref(false)
const hasError = ref(false)
// ✅ VARIABLES DE PAGINACIÓN
const currentPage = ref(0)
const limit = 10 // Número de ítems por página
const totalTechs = ref(0)

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
    console.log('data techs: ', techs.value)

    if (isLoadMore) {
      // ✅ AÑADIMOS los nuevos resultados a la lista existente
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

// ✅ COMPUTADA para saber si hay más páginas
const hasMoreTechs = computed(() => {
  if (!techs.value || totalTechs.value === null) return false
  return techs.value.length < totalTechs.value
})

onMounted(() => {
  fetchTechs()
})

const handleViewTech = (tech: Tables<'techs'>) => {
  // Navegamos a la nueva página de previsualización de la tecnología
  router.push({ name: 'admin-tech-preview', params: { id: tech.id } })
}

// ✅ LÓGICA DEL BOTÓN "VER MÁS"
const loadMoreTechs = () => {
  console.log('Cargando más tecnologías...')
  currentPage.value++
  fetchTechs(true)
}

// ✅ Lógica de creación del modal
const handleCreateTech = async () => {
  const result = await modal.showModal(CreateTechModal, {}, { title: 'Crear Nueva Tecnología' })

  // Si el modal se cierra con 'confirm'
  if (result?.action === 'confirm') {
    await fetchTechs() // Vuelve a cargar la lista de tecnologías para ver el cambio
    toastStore.addToast({ message: 'Tecnología creada con éxito.', type: 'success' })
  }
}

const handleEditTech = async (tech: Tables<'techs'>) => {
  try {
    // Añadimos un log para ver la data recibida
    console.log('Datos de la tecnología a editar:', tech)
    const result = await modal.showModal(
      TechFormModal, // ✅ USAMOS EL NUEVO MODAL DE ACTUALIZACIÓN
      { tech }, // ✅ PASAMOS EL OBJETO DE LA TECNOLOGÍA COMO PROP
      {},
    )
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

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold dark:text-gray-100">Gestión de Tecnologías</h2>
      <UiButton @click="handleCreateTech" intent="primary"> Crear Nueva Tecnología </UiButton>
    </div>

    <AdminList
      :items="techs"
      :loading="loading"
      :has-error="hasError"
      empty-message="No hay tecnologías para mostrar."
    >
      <template #loading>
        <SkeletonListTechs />
      </template>

      <template #default="{ items }">
        <ul role="list" class="divide-y divide-gray-100 dark:divide-gray-800 gap-2">
          <TechListItem
            v-for="tech in items"
            :key="tech.id"
            :tech="tech"
            :tech-description="`ID: ${tech.id}`"
            @view="handleViewTech(tech)"
            @edit="handleEditTech(tech)"
            @delete="handleDeleteTech(tech.id, tech.name)"
          />
        </ul>
      </template>
    </AdminList>
    <div v-if="hasMoreTechs" class="mt-6 text-center">
      <UiButton intent="secondary" full-width @click="loadMoreTechs" :disabled="loadingMore">
        <span v-if="loadingMore">Cargando...</span>
        <span v-else>Ver más tecnologías</span>
      </UiButton>
    </div>
  </div>
</template>

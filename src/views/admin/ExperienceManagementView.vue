<script setup lang="ts" name="ExperienceManagementView">
import { ref, onMounted } from 'vue'
import { useGlobalModal } from '@/composables/useGlobalModal'
import { useToastStore } from '@/stores/toast'
import { experienceService } from '@/services/experienceService'
import UiButton from '@/components/ui/UiButton.vue'
import AdminList from '@/components/ui/AdminList.vue'
import ExperienceListItem from '@/components/admin/ExperienceListItem.vue'
import SkeletonListExperience from '@/components/ui/skeletons/SkeletonListExperience.vue'
import ConfirmDeleteModal from '@/components/ui/modals/ConfirmDeleteModal.vue'
import type { Tables } from '@/types/supabase'
import CreateExperienceModal from '@/components/ui/modals/CreateExperienceModal.vue'
import ExperienceFormModal from '@/components/ui/modals/ExperienceFormModal.vue'
import UiAlert from '@/components/ui/UiAlert.vue'

const modal = useGlobalModal()
const toastStore = useToastStore()

// Usamos el tipo correcto para la tabla de experiencia.
const experiences = ref<Tables<'work_experience'>[] | null>(null)
const loading = ref(true)
const hasError = ref(false)

const fetchExperiences = async () => {
  try {
    loading.value = true
    hasError.value = false
    // Usamos la función getAllExperience del servicio
    experiences.value = await experienceService.getAllExperience()
  } catch (error) {
    hasError.value = true
    experiences.value = null
    toastStore.addToast({ message: 'Error al cargar la experiencia.', type: 'error' })
  } finally {
    loading.value = false
  }
}

const handleCreateExperience = async () => {
  // 2. Llama al modal de creación
  const result = await modal.showModal(
    CreateExperienceModal,
    {}, // No necesita props iniciales para la creación
    { title: 'Crear Experiencia' },
  )

  // 3. Maneja el resultado del modal
  if (result?.action === 'confirm') {
    await fetchExperiences()
    toastStore.addToast({ message: 'Experiencia creada con éxito.', type: 'success' })
  } else if (result?.action === 'cancel') {
    toastStore.addToast({ message: 'Creación de experiencia cancelada.', type: 'info' })
  }
}

const handleEditExperience = async (experience: Tables<'work_experience'>) => {
  const result = await modal.showModal(
    ExperienceFormModal,
    // Pasamos la experiencia como una prop al modal de edición
    { experienceData: experience },
    {
      // title: `Editar Experiencia: ${experience.company}`,
      closeOnClickOutside: false,
    },
  )

  if (result?.action === 'confirm') {
    await fetchExperiences()
    toastStore.addToast({ message: 'Experiencia actualizada con éxito.', type: 'success' })
  } else if (result?.action === 'cancel') {
    toastStore.addToast({ message: 'Actualización de experiencia cancelada.', type: 'info' })
  }
}

const handleDeleteExperience = async (experienceId: string, company: string) => {
  const result = await modal.showModal(
    ConfirmDeleteModal,
    { itemId: experienceId, title: company },
    { title: 'Confirmar Eliminación' },
  )

  if (result?.action === 'confirm') {
    try {
      await experienceService.deleteExperience(experienceId)
      // Recargamos la lista después de una eliminación exitosa
      await fetchExperiences()
      toastStore.addToast({ message: 'Experiencia eliminada con éxito.', type: 'success' })
    } catch (error) {
      toastStore.addToast({ message: 'Error al eliminar la experiencia.', type: 'error' })
    }
  }
}

onMounted(() => {
  fetchExperiences()
})
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold dark:text-gray-100">Gestión de Experiencia</h2>
      <UiButton @click="handleCreateExperience" intent="primary"> Añadir Experiencia </UiButton>
    </div>

    <AdminList
      :items="experiences"
      :loading="loading"
      :has-error="hasError"
      empty-message="No hay experiencia para mostrar."
    >
      <template #error-message>
        <UiAlert
          title="Error"
          description="No se pudo cargar las de experiencias.  Por favor, inténtalo de nuevo más tarde."
        />
      </template>
      <template #loading>
        <SkeletonListExperience />
      </template>

      <template #default="{ items }">
        <div class="space-y-4">
          <ExperienceListItem
            v-for="exp in items"
            :key="exp.id"
            :experience="exp"
            @edit="handleEditExperience(exp)"
            @delete="handleDeleteExperience(exp.id, exp.company)"
          />
        </div>
      </template>
    </AdminList>
  </div>
</template>

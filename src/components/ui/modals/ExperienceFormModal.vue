<template>
  <div class="container mx-auto">
    <div class="flex justify-end mb-4">
      <button
        type="button"
        @click="toggleLock"
        class="text-xl transition-colors duration-200"
        :class="{
          'text-gray-500 hover:text-green-500': isLocked,
          'text-green-500 hover:text-gray-500': !isLocked,
        }"
        aria-label="Toggle edit mode"
      >
        {{ isLocked ? 'Desbloquear' : 'Bloquear' }}
        <FontAwesomeIcon :icon="isLocked ? 'fa-solid fa-lock' : 'fa-solid fa-lock-open'" />
      </button>
    </div>

    <form v-if="!showSummary" @submit.prevent="proceedToSummary">
      <div class="space-y-4" :class="{ 'cursor-not-allowed': isLocked }">
        <UiFormField
          label="Compañía"
          type="text"
          v-model="form.company"
          id="experience-company"
          required
          :disabled="isLocked"
        >
          <template #icon>
            <FontAwesomeIcon icon="fa-solid fa-building" />
          </template>
        </UiFormField>

        <UiFormField
          label="Puesto"
          type="text"
          v-model="form.role"
          id="experience-role"
          required
          :disabled="isLocked"
        >
          <template #icon>
            <FontAwesomeIcon icon="fa-solid fa-briefcase" />
          </template>
        </UiFormField>

        <UiTextarea
          label="Descripción de la experiencia"
          v-model="form.description"
          id="experience-description"
          required
          :disabled="isLocked"
        />

        <div class="flex flex-col md:flex-row gap-4">
          <UiFormField
            label="Fecha de inicio"
            type="date"
            v-model="form.start_date"
            id="experience-start-date"
            required
            :disabled="isLocked"
          >
            <template #icon>
              <FontAwesomeIcon icon="fa-solid fa-calendar-alt" />
            </template>
          </UiFormField>

          <UiFormField
            v-if="!isCurrent"
            label="Fecha de finalización"
            type="date"
            v-model="form.end_date"
            id="experience-end-date"
            :disabled="isLocked"
          >
            <template #icon>
              <FontAwesomeIcon icon="fa-solid fa-calendar-alt" />
            </template>
          </UiFormField>
        </div>

        <UiSwitch
          label="Puesto actual"
          v-model="isCurrent"
          id="experience-is-current"
          :disabled="isLocked"
        />

        <UiSelect
          v-if="projects.length"
          label="Vincular a proyecto (opcional)"
          v-model="form.project_id"
          :options="projectOptions"
          id="experience-project-link"
          :disabled="isLocked"
        >
          <template #icon>
            <FontAwesomeIcon icon="fa-solid fa-project-diagram" />
          </template>
        </UiSelect>
      </div>

      <div class="mt-6 flex justify-end space-x-2">
        <UiButton @click="handleCancel" intent="secondary" type="button">Cancelar</UiButton>
        <UiButton type="submit" intent="primary" :disabled="isLocked">
          Revisar Actualización
        </UiButton>
      </div>
    </form>

    <div v-else class="container mx-auto mt-2">
      <h3 class="text-lg font-bold text-center mb-4 flex items-center justify-center gap-2">
        <FontAwesomeIcon icon="fa-solid fa-arrows-rotate" class="text-yellow-500" />
        Confirmar Actualización
      </h3>
      <div class="space-y-4 text-sm">
        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p class="font-semibold flex items-center gap-2">
            <FontAwesomeIcon icon="fa-solid fa-building" class="text-blue-500" />Compañía:
          </p>
          <p class="text-gray-600 dark:text-gray-400">{{ form.company }}</p>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p class="font-semibold flex items-center gap-2">
            <FontAwesomeIcon icon="fa-solid fa-briefcase" class="text-blue-500" />Puesto:
          </p>
          <p class="text-gray-600 dark:text-gray-400">{{ form.role }}</p>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p class="font-semibold flex items-center gap-2">
            <FontAwesomeIcon icon="fa-solid fa-calendar-alt" class="text-blue-500" />Periodo:
          </p>
          <p class="text-gray-600 dark:text-gray-400">
            {{ formattedPeriod }}
          </p>
        </div>
        <div
          v-if="linkedProjectSummary"
          class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center gap-2"
        >
          <p class="font-semibold flex items-center gap-2">
            <FontAwesomeIcon icon="fa-solid fa-project-diagram" class="text-blue-500" />Proyecto
            Vinculado:
          </p>
          <p class="text-gray-600 dark:text-gray-400">
            {{ linkedProjectSummary }}
          </p>
        </div>
        <div v-if="form.description" class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p class="font-semibold flex items-center gap-2">
            <FontAwesomeIcon icon="fa-solid fa-file-signature" class="text-blue-500" />Descripción
            Completa:
          </p>
          <p class="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{{ form.description }}</p>
        </div>
      </div>

      <div class="mt-6 flex justify-end space-x-2">
        <UiButton @click="showSummary = false" intent="secondary" type="button">
          Volver y Editar
        </UiButton>
        <UiButton @click="updateExperience" intent="primary" :disabled="loading">
          <span v-if="loading" class="flex items-center gap-2">
            <UiSpinner class="w-4 h-4" />
            Actualizando...
          </span>
          <span v-else>Confirmar y Guardar</span>
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import {
  faBuilding,
  faBriefcase,
  faCalendarAlt,
  faProjectDiagram,
  faArrowsRotate,
  faFileSignature,
  faLock,
  faLockOpen,
} from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import UiButton from '@/components/ui/UiButton.vue'
import UiFormField from '@/components/ui/UiFormField.vue'
import UiTextarea from '@/components/ui/UiTextarea.vue'
import UiSwitch from '@/components/ui/UiSwitch.vue'
import UiSelect from '@/components/ui/UiSelect.vue'
import UiSpinner from '@/components/ui/UiSpinner.vue'
import { experienceService } from '@/services/experienceService'
import { projectService } from '@/services/projectService'
import type { Tables } from '@/types/supabase'
import type { ModalResult } from '@/types/modal'

library.add(
  faBuilding,
  faBriefcase,
  faCalendarAlt,
  faProjectDiagram,
  faArrowsRotate,
  faFileSignature,
  faLock,
  faLockOpen,
)

export default defineComponent({
  name: 'ExperienceFormModal',
  components: {
    FontAwesomeIcon,
    UiButton,
    UiFormField,
    UiTextarea,
    UiSwitch,
    UiSelect,
    UiSpinner,
  },
  props: {
    modalId: { type: Number, required: true },
    __onConfirm: { type: Function, required: true },
    __onCancel: { type: Function, required: true },
    __onClose: { type: Function, required: true },
    // Propiedad para la experiencia a editar. Es obligatoria para este modal.
    experienceData: {
      type: Object as () => Tables<'work_experience'>,
      required: true,
    },
  },
  setup(props) {
    const form = ref<Tables<'work_experience'>['Update']>({
      company: '',
      role: '',
      description: '',
      start_date: '',
      end_date: '',
      project_id: null,
    })
    const isCurrent = ref(false)
    const projects = ref<Tables<'projects'>[]>([])
    const loading = ref(false)
    const showSummary = ref(false)
    const isLocked = ref(true)

    onMounted(async () => {
      // Bloquear el modal si no hay experiencia para editar
      if (!props.experienceData) {
        props.__onClose({ action: 'error', payload: 'No se encontraron datos para editar.' })
        return
      }

      await fetchProjects()

      // Llenar el formulario con los datos de la experiencia
      form.value = {
        ...props.experienceData,
        // Aseguramos que la fecha de fin sea una cadena vacía o null
        end_date: props.experienceData.end_date || '',
        // Excluimos `id` y `created_at` para el payload de actualización
        id: undefined,
        created_at: undefined,
      } as Tables<'work_experience'>['Update']
      isCurrent.value = props.experienceData.end_date === null
    })

    const projectOptions = computed(() => {
      if (!projects.value) return []
      return [
        { value: null, label: 'Ninguno' },
        ...projects.value.map((p) => ({ value: p.id, label: `${p.title} (${p.slug})` })),
      ]
    })

    const formattedPeriod = computed(() => {
      const startDate = new Date(form.value.start_date || '')
      const endDate = isCurrent.value ? new Date() : new Date(form.value.end_date || '')
      const endText = isCurrent.value ? 'Presente' : format(endDate, 'MMM yyyy', { locale: es })
      return `${format(startDate, 'MMM yyyy', { locale: es })} - ${endText}`
    })

    const linkedProjectSummary = computed(() => {
      const selectedProject = projects.value.find((p) => p.id === form.value.project_id)
      return selectedProject ? `${selectedProject.title} (${selectedProject.slug})` : null
    })

    const toggleLock = () => {
      isLocked.value = !isLocked.value
    }

    const fetchProjects = async () => {
      try {
        const data = await projectService.getAllProjectsWithoutPagination()
        if (data) {
          projects.value = data
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
      }
    }

    const proceedToSummary = () => {
      showSummary.value = true
    }

    const updateExperience = async () => {
      loading.value = true
      try {
        const payload = {
          ...form.value,
          end_date: isCurrent.value ? null : form.value.end_date,
        }

        await experienceService.updateExperience(props.experienceData.id, payload)
        props.__onConfirm({ action: 'confirm', payload: null } as ModalResult)
      } catch (error) {
        console.error('Error al actualizar la experiencia:', error)
        props.__onClose({ action: 'error', payload: null } as ModalResult)
      } finally {
        loading.value = false
      }
    }

    const handleCancel = () => {
      props.__onCancel({ action: 'cancel', payload: null } as ModalResult)
    }

    return {
      form,
      isCurrent,
      projects,
      loading,
      showSummary,
      isLocked,
      projectOptions,
      formattedPeriod,
      linkedProjectSummary,
      toggleLock,
      proceedToSummary,
      updateExperience,
      handleCancel,
    }
  },
  watch: {
    isCurrent(newValue: boolean) {
      if (newValue) {
        this.form.end_date = null
      } else {
        this.form.end_date = ''
      }
    },
  },
})
</script>

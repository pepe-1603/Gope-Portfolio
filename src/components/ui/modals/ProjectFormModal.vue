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
      <div class="space-y-3" :class="{ 'cursor-not-allowed': isLocked }">
        <UiFormField
          label="Título"
          type="text"
          v-model="form.title"
          id="project-title"
          required
          :disabled="isLocked"
        >
          <template #icon><FontAwesomeIcon icon="fa-solid fa-heading" /></template>
        </UiFormField>

        <UiFormField
          label="Resumen"
          type="text"
          v-model="form.summary"
          id="project-summary"
          :disabled="isLocked"
          required
        >
          <template #icon><FontAwesomeIcon icon="fa-solid fa-file-lines" /></template>
        </UiFormField>
        <UiTextarea
          label="Descripción completa"
          v-model="form.description"
          id="project-description"
          :min-rows="4"
          :max-rows="12"
          :disabled="isLocked"
        />
        <UiFormField
          label="URL de la Imagen"
          type="url"
          v-model="form.image_url"
          id="project-image-url"
          :disabled="isLocked"
        >
          <template #icon><FontAwesomeIcon icon="fa-solid fa-image" /></template>
        </UiFormField>
        <UiFormField
          label="URL del Proyecto en vivo"
          type="url"
          v-model="form.live_url"
          id="project-live-url"
          :disabled="isLocked"
        >
          <template #icon
            ><FontAwesomeIcon icon="fa-solid fa-arrow-up-right-from-square"
          /></template>
        </UiFormField>
        <UiFormField
          label="URL del Repositorio"
          type="url"
          v-model="form.repo_url"
          id="project-repo-url"
          :disabled="isLocked"
        >
          <template #icon><FontAwesomeIcon icon="fa-solid fa-code" /></template>
        </UiFormField>
        <UiFormField
          label="Slug (URL del proyecto)"
          type="text"
          v-model="form.slug"
          id="project-slug"
          :disabled="isLocked"
        >
          <template #icon><FontAwesomeIcon icon="fa-solid fa-link" /></template>
        </UiFormField>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tecnologías
          </label>
          <div class="flex flex-wrap gap-2">
            <UiChip
              v-for="tech in allTechs"
              :key="tech.id"
              :text="tech.name"
              :active="selectedTechs.some((t) => t.id === tech.id)"
              @click="!isLocked && toggleTech(tech)"
              :class="{ 'cursor-not-allowed': isLocked }"
            />
          </div>
        </div>

        <UiSwitch
          label="Mantener publico el proyecto."
          v-model="form.is_published"
          id="project-is-published"
          :disabled="isLocked"
        />
      </div>

      <div class="mt-6 flex justify-end space-x-2">
        <UiButton @click="handleCancel" intent="secondary" type="button">Cancelar</UiButton>
        <UiButton type="submit" intent="primary" :disabled="isLocked"
          >Revisar Actualización</UiButton
        >
      </div>
    </form>

    <div v-else>
      <h3 class="text-lg font-bold text-center mb-4 flex items-center justify-center gap-2">
        <FontAwesomeIcon icon="fa-solid fa-arrows-rotate" class="text-yellow-500" />
        Confirmar Actualización
      </h3>
      <div class="space-y-4 text-sm">
        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p class="font-semibold flex items-center gap-2">
            <FontAwesomeIcon icon="fa-solid fa-heading" class="text-blue-500" />Título:
          </p>
          <p class="text-gray-600 dark:text-gray-400">{{ form.title }}</p>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p class="font-semibold flex items-center gap-2">
            <FontAwesomeIcon icon="fa-solid fa-link" class="text-blue-500" />Slug:
          </p>
          <p class="text-gray-600 dark:text-gray-400">{{ form.slug }}</p>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p class="font-semibold flex items-center gap-2">
            <FontAwesomeIcon icon="fa-solid fa-file-lines" class="text-blue-500" />Resumen:
          </p>
          <p class="text-gray-600 dark:text-gray-400">{{ form.summary }}</p>
        </div>
        <div v-if="form.description" class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p class="font-semibold flex items-center gap-2">
            <FontAwesomeIcon icon="fa-solid fa-file-signature" class="text-blue-500" />Descripción
            Completa:
          </p>
          <p class="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{{ form.description }}</p>
        </div>
        <div v-if="form.image_url" class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p class="font-semibold flex items-center gap-2">
            <FontAwesomeIcon icon="fa-solid fa-image" class="text-blue-500" />Imagen de Portada:
          </p>
          <img
            :src="form.image_url"
            alt="Vista previa del proyecto"
            class="mt-2 w-full rounded-lg border-2 border-gray-300 dark:border-gray-600"
          />
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p class="font-semibold flex items-center gap-2">
            <FontAwesomeIcon icon="fa-solid fa-gears" class="text-blue-500" />Tecnologías:
          </p>
          <div class="flex flex-wrap gap-2 mt-1">
            <UiChip v-for="tech in selectedTechs" :key="tech.id" :text="tech.name" :active="true" />
          </div>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p class="font-semibold flex items-center gap-2">
            <FontAwesomeIcon icon="fa-solid fa-cloud-arrow-up" class="text-blue-500" />Publicado:
          </p>
          <p class="text-gray-600 dark:text-gray-400">
            {{ form.is_published ? 'Sí' : 'No' }}
          </p>
        </div>
      </div>

      <div class="mt-6 flex justify-end space-x-2">
        <UiButton @click="showSummary = false" intent="secondary" type="button"
          >Volver y Editar Formulario</UiButton
        >
        <UiButton @click="updateProject" intent="primary" :disabled="loading">
          <span v-if="loading" class="flex items-center gap-2">
            <UiSpinner class="w-4 h-4" />
            Actualizando...
          </span>
          <span v-else>Confirmar y Actualizar</span>
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiFormField from '@/components/ui/UiFormField.vue'
import UiTextarea from '@/components/ui/UiTextarea.vue'
import UiSwitch from '@/components/ui/UiSwitch.vue'
import UiChip from '@/components/ui/UiChip.vue'
import UiSpinner from '@/components/ui/UiSpinner.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faHeading,
  faFileLines,
  faImage,
  faArrowUpRightFromSquare,
  faCode,
  faLink,
  faGears,
  faCloudArrowUp,
  faArrowsRotate,
  faFileSignature,
  faLock,
  faLockOpen, // Nuevo icono para el modal de actualización
} from '@fortawesome/free-solid-svg-icons'
import type { Tables } from '@/types/supabase'
import type { ProjectWithTechs } from '@/types/project'
import { techService } from '@/services/techService'
import { projectService } from '@/services/projectService'
import type { ModalResult } from '@/types/modal'

library.add(
  faHeading,
  faFileLines,
  faImage,
  faArrowUpRightFromSquare,
  faCode,
  faLink,
  faGears,
  faCloudArrowUp,
  faArrowsRotate,
  faFileSignature,
  faLock,
  faLockOpen,
)

export default defineComponent({
  name: 'ProjectFormModal',
  props: {
    projectData: {
      type: Object as () => ProjectWithTechs,
      required: true,
    },
    modalId: { type: Number, required: true },
    __onConfirm: { type: Function, required: true },
    __onCancel: { type: Function, required: true },
    __onClose: { type: Function, required: true },
  },
  setup(props) {
    const form = ref({
      title: props.projectData?.title || '',
      summary: props.projectData?.summary || '',
      description: props.projectData?.description || '',
      image_url: props.projectData?.image_url || '',
      live_url: props.projectData?.live_url || '',
      repo_url: props.projectData?.repo_url || '',
      slug: props.projectData?.slug || '',
      is_published: props.projectData?.is_published || false,
    })

    const allTechs = ref<Tables<'techs'>[]>([])
    const selectedTechs = ref<Tables<'techs'>[]>([])
    const loading = ref(false)
    const showSummary = ref(false)
    const originalTitle = ref(props.projectData?.title || '')
    const isLocked = ref(true) // Estado de bloqueo, inicialmente true

    onMounted(async () => {
      const allTechsData = await techService.getAllTechs()
      if (allTechsData) {
        allTechs.value = allTechsData
      }
      if (props.projectData && props.projectData.project_techs) {
        // Aseguramos que `project_techs` existe antes de mapear
        const techs = props.projectData.project_techs.map((pt) => pt.techs)
        selectedTechs.value = techs
        // Log para confirmar que las techs se cargaron
        console.log('Tecnologías del proyecto cargadas en el modal:', selectedTechs.value)
      }
    })

    const toggleLock = () => {
      isLocked.value = !isLocked.value
    }

    const toggleTech = (tech: Tables<'techs'>) => {
      const index = selectedTechs.value.findIndex((t) => t.id === tech.id)
      if (index === -1) {
        selectedTechs.value.push(tech)
      } else {
        selectedTechs.value.splice(index, 1)
      }
    }

    const generateSlug = (title: string) => {
      return title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
    }

    const proceedToSummary = () => {
      // Si el título ha cambiado, regeneramos el slug
      if (form.value.title !== originalTitle.value) {
        form.value.slug = generateSlug(form.value.title)
      }
      console.log('Datos a previsualizar:', form.value)
      console.log('Tecnologías seleccionadas:', selectedTechs.value)
      showSummary.value = true
    }

    const updateProject = async () => {
      loading.value = true
      const projectPayload = {
        title: form.value.title,
        slug: form.value.slug,
        summary: form.value.summary,
        description: form.value.description,
        image_url: form.value.image_url,
        live_url: form.value.live_url,
        repo_url: form.value.repo_url,
        is_published: form.value.is_published,
      }

      console.log('Enviando datos para actualizar el proyecto:', projectPayload)
      console.log(
        'Enviando IDs de tecnologías para actualizar:',
        selectedTechs.value.map((t) => t.id),
      )

      try {
        await projectService.updateProjectAndTechs(
          props.projectData.id,
          projectPayload,
          selectedTechs.value.map((t) => t.id),
        )

        props.__onConfirm({ action: 'confirm', payload: null } as ModalResult)
      } catch (error) {
        console.error('Error al actualizar el proyecto:', error)
        props.__onClose({ action: 'error', payload: null } as ModalResult)
      } finally {
        loading.value = false
      }
    }

    const handleCancel = () => {
      props.__onCancel({ action: 'cancel', payload: null } as ModalResult)
    }

    return {
      props,
      form,
      allTechs,
      selectedTechs,
      loading,
      showSummary,
      toggleTech,
      isLocked, // Exponer la variable de estado
      toggleLock, // Exponer la función para alternar
      proceedToSummary,
      updateProject,
      handleCancel,
    }
  },
  components: {
    UiButton,
    UiFormField,
    UiTextarea,
    UiSwitch,
    UiChip,
    UiSpinner,
    FontAwesomeIcon,
  },
})
</script>

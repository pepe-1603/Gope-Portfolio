<template>
  <div class="container mx-auto">
    <form v-if="!showSummary" @submit.prevent="proceedToSummary">
      <div class="space-y-4">
        <UiFormField label="Título" type="text" v-model="form.title" id="project-title" required>
          <template #icon><FontAwesomeIcon icon="fa-solid fa-heading" /></template>
        </UiFormField>
        <UiFormField
          label="Resumen"
          type="text"
          v-model="form.summary"
          id="project-summary"
          required
        >
          <template #icon><FontAwesomeIcon icon="fa-solid fa-file-lines" /></template>
        </UiFormField>
        <UiTextarea
          class="h-fit"
          label="Descripción completa"
          v-model="form.description"
          id="project-description"
        />
        <UiFormField
          label="URL de la Imagen"
          type="url"
          v-model="form.image_url"
          id="project-image-url"
        >
          <template #icon>
            <FontAwesomeIcon icon="fa-solid fa-image" />
          </template>
        </UiFormField>
        <UiFormField
          label="URL del Proyecto en vivo"
          type="url"
          v-model="form.live_url"
          id="project-live-url"
        >
          <template #icon>
            <FontAwesomeIcon icon="fa-solid fa-arrow-up-right-from-square" />
          </template>
        </UiFormField>
        <UiFormField
          label="URL del Repositorio"
          type="url"
          v-model="form.repo_url"
          id="project-repo-url"
        >
          <template #icon>
            <FontAwesomeIcon icon="fa-solid fa-code" />
          </template>
        </UiFormField>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >Tecnologías</label
          >
          <div class="flex flex-wrap gap-2">
            <UiChip
              v-for="tech in allTechs"
              :key="tech.id"
              :text="tech.name"
              :active="selectedTechs.some((t) => t.id === tech.id)"
              @click="toggleTech(tech)"
            />
          </div>
        </div>

        <UiSwitch
          label="Hacer público el proyecto."
          v-model="form.is_published"
          id="project-is-published"
        />
      </div>

      <div class="mt-6 flex justify-end space-x-2">
        <UiButton @click="handleCancel" intent="secondary" type="button"> Cancelar </UiButton>
        <UiButton type="submit" intent="primary">Revisar y Crear</UiButton>
      </div>
    </form>

    <div class="container mx-auto mt-2" v-else>
      <h3 class="text-lg font-bold text-center mb-4 flex items-center justify-center gap-2">
        <FontAwesomeIcon icon="fa-solid fa-circle-check" class="text-green-500" /> Confirmar
        Creación del Proyecto
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
          <p class="text-gray-600 dark:text-gray-400">{{ generatedSlug }}</p>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p class="font-semibold flex items-center gap-2">
            <FontAwesomeIcon icon="fa-solid fa-file-lines" class="text-blue-500" />Resumen:
          </p>
          <p class="text-gray-600 dark:text-gray-400">{{ form.summary }}</p>
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
        <UiButton @click="handleSubmit" intent="primary" :disabled="loading">
          <span v-if="loading" class="flex items-center gap-2">
            <UiSpinner class="w-4 h-4" />
            Creando...
          </span>
          <span v-else>Confirmar y Crear</span>
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiFormField from '@/components/ui/UiFormField.vue'
import UiTextarea from '@/components/ui/UiTextarea.vue'
import UiSwitch from '@/components/ui/UiSwitch.vue'
import UiChip from '@/components/ui/UiChip.vue'
import UiSpinner from '@/components/ui/UiSpinner.vue'
import type { Tables } from '@/types/supabase'
import { techService } from '@/services/techService'
import { projectService } from '@/services/projectService'
import type { ModalResult } from '@/types/modal'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faCode,
  faImage,
  faArrowUpRightFromSquare,
  faCircleCheck,
  faHeading,
  faFileLines,
  faGears,
  faCloudArrowUp,
  faLink, // Nuevo icono para el slug
} from '@fortawesome/free-solid-svg-icons'

// Agregar todos los iconos al library
library.add(
  faCode,
  faImage,
  faArrowUpRightFromSquare,
  faCircleCheck,
  faHeading,
  faFileLines,
  faGears,
  faCloudArrowUp,
  faLink, // Añadir el nuevo icono
)

export default defineComponent({
  name: 'CreateProjectModal',
  props: {
    modalId: { type: Number, required: true },
    __onConfirm: { type: Function, required: true },
    __onCancel: { type: Function, required: true },
    __onClose: { type: Function, required: true },
  },
  data() {
    return {
      form: {
        title: '',
        slug: '', // Añadimos slug al formulario para su gestión interna
        summary: '',
        description: '',
        image_url: '',
        live_url: '',
        repo_url: '',
        is_published: false,
      },
      allTechs: [] as Tables<'techs'>[],
      selectedTechs: [] as Tables<'techs'>[],
      loading: false,
      showSummary: false,
    }
  },
  computed: {
    generatedSlug(): string {
      return this.form.title
        .toLowerCase()
        .replace(/\s+/g, '-') // Reemplazar espacios por guiones
        .replace(/[^\w-]+/g, '') // Eliminar caracteres no alfanuméricos excepto guiones
    },
  },
  async mounted() {
    const allTechsData = await techService.getAllTechs()
    if (allTechsData) {
      this.allTechs = allTechsData
    }
  },
  methods: {
    toggleTech(tech: Tables<'techs'>) {
      const index = this.selectedTechs.findIndex((t) => t.id === tech.id)
      if (index === -1) {
        this.selectedTechs.push(tech)
      } else {
        this.selectedTechs.splice(index, 1)
      }
    },
    proceedToSummary() {
      // Al pasar al resumen, actualizamos el slug
      this.form.slug = this.generatedSlug
      this.showSummary = true
    },
    async handleSubmit() {
      this.loading = true
      const projectPayload = {
        ...this.form,
        is_published: this.form.is_published,
        slug: this.form.slug, // Aseguramos que el slug esté en el payload final
      }

      try {
        await projectService.createProjectAndTechs(
          projectPayload,
          this.selectedTechs.map((t) => t.id),
        )
        this.__onConfirm({ action: 'confirm', payload: null } as ModalResult)
      } catch (error) {
        console.error('Error al crear el proyecto:', error)
        this.__onClose({ action: 'error', payload: null } as ModalResult)
      } finally {
        this.loading = false
      }
    },
    handleCancel() {
      this.__onCancel({ action: 'cancel', payload: null } as ModalResult)
    },
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

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <UiFormField
      label="Compañía"
      type="text"
      v-model="form.company"
      id="experience-company"
      required
    >
      <template #icon>
        <FontAwesomeIcon icon="fa-solid fa-building" />
      </template>
    </UiFormField>

    <UiFormField label="Puesto" type="text" v-model="form.role" id="experience-role" required>
      <template #icon>
        <FontAwesomeIcon icon="fa-solid fa-briefcase" />
      </template>
    </UiFormField>

    <UiTextarea
      label="Descripción de la experiencia"
      v-model="form.description"
      id="experience-description"
      required
    />

    <div class="flex flex-col md:flex-row gap-4">
      <UiFormField
        label="Fecha de inicio"
        type="date"
        v-model="form.start_date"
        id="experience-start-date"
        required
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
      >
        <template #icon>
          <FontAwesomeIcon icon="fa-solid fa-calendar-alt" />
        </template>
      </UiFormField>
    </div>

    <UiSwitch label="Puesto actual" v-model="isCurrent" id="experience-is-current" />

    <UiSelect
      v-if="projects.length"
      label="Vincular a proyecto (opcional)"
      v-model="form.project_id"
      :options="projectOptions"
      id="experience-project-link"
    >
      <template #icon>
        <FontAwesomeIcon icon="fa-solid fa-project-diagram" />
      </template>
    </UiSelect>

    <div class="mt-6 flex justify-end space-x-2">
      <UiButton @click="handleCancel" intent="secondary" type="button">Cancelar</UiButton>
      <UiButton type="submit" intent="primary" :disabled="loading">
        <span v-if="loading" class="flex items-center gap-2">
          <UiSpinner class="w-4 h-4" />
          Creando...
        </span>
        <span v-else>Crear Experiencia</span>
      </UiButton>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faBuilding,
  faBriefcase,
  faCalendarAlt,
  faProjectDiagram,
} from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import UiButton from '@/components/ui/UiButton.vue'
import UiFormField from '@/components/ui/UiFormField.vue'
import UiTextarea from '@/components/ui/UiTextarea.vue'
import UiSwitch from '@/components/ui/UiSwitch.vue'
import UiSelect from '@/components/ui/UiSelect.vue'
import UiSpinner from '@/components/ui/UiSpinner.vue'
import { experienceService } from '@/services/experienceService'
import { projectService } from '@/services/projectService'
import type { Tables, TablesInsert } from '@/types/supabase'
import type { ModalResult } from '@/types/modal'

// Quitamos el ícono de la imagen, ya que no se necesita
library.add(faBuilding, faBriefcase, faCalendarAlt, faProjectDiagram)

// ✅ Nuevo tipo para el formulario que soporta string (para el input) y null (para la DB)
type ExperienceFormUI = Omit<
  TablesInsert<'work_experience'>,
  'start_date' | 'end_date' | 'project_id'
> & {
  start_date: string | null
  end_date: string | null
  project_id: string | null
}

export default defineComponent({
  name: 'CreateExperienceModal',
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
  },
  data() {
    return {
      // ✅ Usamos el tipo local para el estado del formulario de la UI
      form: {
        company: '',
        role: '',
        description: '',
        start_date: '',
        // Inicializamos a cadena vacía para que el input funcione.
        end_date: '',
        project_id: null,
      } as ExperienceFormUI,
      isCurrent: false,
      projects: [] as Tables<'projects'>[],
      loading: false,
    }
  },
  computed: {
    projectOptions(): { value: string | null; label: string }[] {
      if (!this.projects) return []
      return [
        { value: null, label: 'Ninguno' },
        // Aseguramos que el ID del proyecto sea un string (o null)
        ...this.projects.map((p) => ({ value: p.id, label: `${p.title} (${p.slug})` })),
      ]
    },
  },
  watch: {
    isCurrent(newValue: boolean) {
      if (newValue) {
        // Al marcar el puesto actual, el valor debe ser `null` para la base de datos.
        this.form.end_date = null
      } else {
        // Al desmarcar, lo volvemos a una cadena vacía para que el input funcione correctamente.
        this.form.end_date = ''
      }
    },
  },
  async mounted() {
    await this.fetchProjects()
  },
  methods: {
    async fetchProjects() {
      try {
        const data = await projectService.getAllProjectsWithoutPagination()
        if (data) {
          this.projects = data
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
      }
    },
    async handleSubmit() {
      this.loading = true
      try {
        // ✅ CORRECCIÓN/MEJORA: Aseguramos el tipado final para el servicio.
        const payload: TablesInsert<'work_experience'> = {
          company: this.form.company,
          role: this.form.role,
          description: this.form.description,
          // Convertimos cadena vacía ('') a null para Supabase
          start_date: this.form.start_date || null,
          // Si es actual es null, si no, toma el valor o null si está vacío.
          end_date: this.isCurrent ? null : this.form.end_date || null,
          project_id: this.form.project_id || null, // Asegurar que sea string o null
        }

        await experienceService.createExperience(payload)
        this.__onConfirm({ action: 'confirm', payload: null } as ModalResult)
      } catch (error) {
        console.error('Error al crear la experiencia:', error)
        this.__onClose({ action: 'error', payload: null })
      } finally {
        this.loading = false
      }
    },
    handleCancel() {
      this.__onCancel({ action: 'cancel', payload: null } as ModalResult)
    },
  },
})
</script>

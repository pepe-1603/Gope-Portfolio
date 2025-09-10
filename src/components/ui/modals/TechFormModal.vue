<template>
  <form @submit.prevent="handleSubmit">
    <div class="space-y-4">
      <UiFormField
        label="Nombre de la Tecnología"
        type="text"
        v-model="form.name"
        id="tech-name"
        required
      >
        <template #icon><FontAwesomeIcon icon="fa-solid fa-tag" /></template>
      </UiFormField>
      <UiFormField
        label="URL del Ícono"
        type="url"
        v-model="form.icon_url"
        id="tech-icon-url"
        required
      >
        <template #icon>
          <FontAwesomeIcon icon="fa-solid fa-image" />
        </template>
      </UiFormField>
    </div>

    <div class="mt-6 flex justify-end space-x-2">
      <UiButton @click="handleCancel" intent="secondary" type="button"> Cancelar </UiButton>
      <UiButton type="submit" intent="primary" :disabled="loading">
        <span v-if="loading" class="flex items-center gap-2">
          <UiSpinner class="w-4 h-4" />
          Actualizando...
        </span>
        <span v-else>Actualizar Tecnología</span>
      </UiButton>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiFormField from '@/components/ui/UiFormField.vue'
import UiSpinner from '@/components/ui/UiSpinner.vue'
import type { Tables } from '@/types/supabase'
import { techService } from '@/services/techService'
import type { ModalResult } from '@/types/modal'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faImage, faTag } from '@fortawesome/free-solid-svg-icons'

library.add(faImage, faTag)

export default defineComponent({
  name: 'UpdateTechModal',
  props: {
    modalId: { type: Number, required: true },
    __onConfirm: { type: Function, required: true },
    __onCancel: { type: Function, required: true },
    __onClose: { type: Function, required: true },
    // Propiedad que recibe la tecnología a editar
    tech: {
      type: Object as () => Tables<'techs'>,
      required: true,
    },
  },
  data() {
    return {
      // Pre-poblar el formulario con los datos de la prop
      form: {
        name: this.tech.name || '',
        icon_url: this.tech.icon_url || '',
      },
      loading: false,
    }
  },
  methods: {
    async handleSubmit() {
      this.loading = true
      try {
        // Llamar al servicio de actualización, pasando el ID y el formulario
        await techService.updateTech(this.tech.id, this.form)
        this.__onConfirm({ action: 'confirm', payload: null } as ModalResult)
      } catch (error) {
        console.error('Error al actualizar la tecnología:', error)
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
    UiSpinner,
    FontAwesomeIcon,
  },
})
</script>

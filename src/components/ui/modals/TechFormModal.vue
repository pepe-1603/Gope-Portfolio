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

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Método de subida de ícono
        </label>
        <div class="flex gap-4">
          <UiRadio
            id="upload-method-file"
            name="upload-method"
            label="Subir Archivo"
            value="file"
            v-model="uploadMethod"
          />
          <UiRadio
            id="upload-method-url"
            name="upload-method"
            label="Pegar URL"
            value="url"
            v-model="uploadMethod"
          />
        </div>
      </div>
      <UiDivider />
      <div v-if="uploadMethod === 'file'">
        <ImageUploader
          label="Ícono de la Tecnología"
          :bucket-name="bucketName"
          folder-path="tech-icons"
          v-model="form.icon_url"
          @upload-error="handleImageUploadError"
        />
        <UiAlert v-if="showAlternativeOption" intent="warning" class="mt-2">
          <p>
            Hubo un problema al subir la imagen. Intenta pegar la URL directamente o sube un archivo
            diferente.
          </p>
        </UiAlert>
      </div>

      <div v-else-if="uploadMethod === 'url'">
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
import { defineComponent, ref, watch, onMounted } from 'vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiFormField from '@/components/ui/UiFormField.vue'
import UiSpinner from '@/components/ui/UiSpinner.vue'
import UiRadio from '@/components/ui/UiRadio.vue'
import UiAlert from '@/components/ui/UiAlert.vue'
import ImageUploader from '@/components/ui/ImageUploader.vue'
import UiDivider from '@/components/UiDivider.vue'
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
    tech: {
      type: Object as () => Tables<'techs'>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const form = ref({
      name: props.tech.name || '',
      icon_url: props.tech.icon_url || '',
    })
    const loading = ref(false)
    const uploadMethod = ref<'file' | 'url'>('file')
    const showAlternativeOption = ref(false)
    const bucketName = ref('')

    // Observa la URL del ícono inicial para preseleccionar el método de carga
    watch(
      () => props.tech.icon_url,
      (newVal) => {
        if (newVal) {
          uploadMethod.value = 'url'
        }
      },
      { immediate: true },
    )

    // Observa el cambio en la URL del formulario para limpiar el error
    watch(
      () => form.value.icon_url,
      (newVal) => {
        if (newVal) {
          showAlternativeOption.value = false
        }
      },
    )

    onMounted(() => {
      // Define el nombre del bucket desde las variables de entorno
      bucketName.value = import.meta.env.VITE_SUPABASE_ICONS_BUCKET
    })

    const handleSubmit = async () => {
      loading.value = true
      try {
        await techService.updateTech(props.tech.id, form.value)
        ;(props.__onConfirm as (result: ModalResult) => void)({ action: 'confirm', payload: null })
      } catch (error) {
        console.error('Error al actualizar la tecnología:', error)
        ;(props.__onClose as (result: ModalResult) => void)({ action: 'error', payload: null })
      } finally {
        loading.value = false
      }
    }

    const handleCancel = () => {
      ;(props.__onCancel as (result: ModalResult) => void)({ action: 'cancel', payload: null })
    }

    const handleImageUploadError = () => {
      showAlternativeOption.value = true
    }

    return {
      form,
      loading,
      uploadMethod,
      showAlternativeOption,
      bucketName,
      handleSubmit,
      handleCancel,
      handleImageUploadError,
    }
  },
  components: {
    UiButton,
    UiFormField,
    UiSpinner,
    UiRadio,
    UiAlert,
    ImageUploader,
    UiDivider,
    FontAwesomeIcon,
  },
})
</script>

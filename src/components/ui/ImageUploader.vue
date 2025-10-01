<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {{ label }}
    </label>
    <div
      class="relative w-full h-48 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-200"
      :class="{
        'border-gray-300 dark:border-gray-600 hover:border-blue-500': !disabled && !uploadError,
        'border-gray-500 bg-gray-100 dark:bg-gray-700 cursor-not-allowed': disabled,
        'border-red-500 hover:border-red-600': uploadError, // Estilo para errores
      }"
      @click="!disabled && fileInput?.click()"
    >
      <input
        type="file"
        ref="fileInput"
        class="hidden"
        @change="handleFileChange"
        :disabled="disabled"
        accept="image/*"
      />
      <div v-if="loading" class="flex flex-col items-center text-blue-500">
        <UiSpinner class="w-8 h-8 mb-2" />
        <span>Subiendo...</span>
      </div>
      <div v-else-if="previewUrl" class="w-full h-full">
        <img
          :src="previewUrl"
          alt="Vista previa de la imagen"
          class="w-full h-full object-cover rounded-lg"
        />
        <button
          v-if="!disabled"
          @click.stop="removeImage"
          class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          title="Eliminar imagen"
        >
          <FontAwesomeIcon icon="fa-solid fa-xmark" />
        </button>
      </div>
      <div v-else class="text-center text-gray-500 dark:text-gray-400">
        <FontAwesomeIcon icon="fa-solid fa-cloud-arrow-up" class="w-10 h-10 mb-2" />
        <p class="text-sm">Haz clic para subir o arrastra una imagen aquí.</p>
      </div>
    </div>

    <UiAlert v-if="uploadError" intent="danger" title="!Ups!, Ocurrio un error" class="mt-2">
      <p>{{ uploadError }}</p>
    </UiAlert>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { faCloudArrowUp, faXmark, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import UiSpinner from '@/components/ui/UiSpinner.vue'
import UiAlert from '@/components/ui/UiAlert.vue' // Importa el nuevo componente
import { StorageService } from '@/services/storageService'
import { useToast } from '@/composables/useToast'

library.add(faCloudArrowUp, faXmark, faSpinner)

const props = defineProps({
  modelValue: {
    type: String,
    default: null,
  },
  bucketName: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: 'Subir Imagen',
  },
  folderPath: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'upload-success', 'upload-error'])

const fileInput = ref<HTMLInputElement | null>(null)
const previewUrl = ref<string | null>(props.modelValue)
const loading = ref(false)
const uploadError = ref<string | null>(null) // Nuevo estado para el error
const toast = useToast()

// Sincronizar la URL de la prop con la vista previa
watch(
  () => props.modelValue,
  (newVal) => {
    previewUrl.value = newVal
    if (newVal) {
      uploadError.value = null // Limpiar el error si la subida fue exitosa
    }
  },
)

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  loading.value = true
  uploadError.value = null // Limpiar error al iniciar nueva subida

  // Lógica de eliminación de imagen anterior
  if (props.modelValue) {
    try {
      const oldFileName = props.modelValue.split('/').pop()?.split('?')[0]
      if (oldFileName) {
        await StorageService.deleteFile(props.bucketName, oldFileName)
      }
    } catch (error) {
      console.error('Error al eliminar la imagen anterior:', error)
      toast.warning('Error al eliminar la imagen anterior. Se subirá la nueva.')
    }
  }

  try {
    const publicUrl = await StorageService.uploadFile(props.bucketName, file, props.folderPath)
    emit('update:modelValue', publicUrl)
    emit('upload-success', publicUrl)
    toast.success('Imagen subida con éxito.')
  } catch (error: any) {
    console.error('Error al subir el archivo:', error)
    uploadError.value = error.message || 'Ocurrió un error al subir la imagen.' // Almacenar el error
    emit('upload-error', error)
    toast.error('Error al subir la imagen. Inténtalo de nuevo.')
  } finally {
    loading.value = false
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

const removeImage = async () => {
  if (!props.modelValue) return

  const fileName = props.modelValue.split('/').pop()?.split('?')[0]
  if (!fileName) return

  loading.value = true
  uploadError.value = null // Limpiar error al eliminar
  try {
    await StorageService.deleteFile(props.bucketName, fileName)
    emit('update:modelValue', null)
    toast.success('Imagen eliminada con éxito.')
  } catch (error: any) {
    console.error('Error al eliminar la imagen:', error)
    uploadError.value = error.message || 'Ocurrió un error al eliminar la imagen.'
    toast.error('Error al eliminar la imagen. Inténtalo de nuevo.')
  } finally {
    loading.value = false
  }
}
</script>

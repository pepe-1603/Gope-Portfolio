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
        'border-red-500 hover:border-red-600': uploadError,
      }"
      @click="!disabled && fileInput?.click()"
    >
      <input
        type="file"
        ref="fileInput"
        class="hidden"
        @change="handleFileSelect"
        :disabled="disabled"
        :accept="accept"
      />

      <div v-if="loading" class="flex flex-col items-center text-blue-500">
        <UiSpinner class="w-8 h-8 mb-2" />
        <span>Subiendo...</span>
      </div>

      <div v-else-if="currentFileUrl" class="w-full h-full">
        <img
          v-if="isImageFile"
          :src="currentFileUrl"
          alt="Vista previa"
          class="w-full h-full object-cover rounded-lg"
        />
        <div v-else class="w-full h-full flex flex-col items-center justify-center p-4">
          <FontAwesomeIcon
            :icon="['fas', 'file']"
            class="text-6xl text-gray-500 dark:text-gray-400"
          />
          <p class="mt-2 text-sm text-center text-gray-600 dark:text-gray-300 truncate w-full px-2">
            {{ getFileName(currentFileUrl) }}
          </p>
        </div>

        <button
          v-if="!disabled"
          @click.stop="removeFile"
          class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          title="Eliminar archivo"
        >
          <FontAwesomeIcon icon="fa-solid fa-xmark" />
        </button>
      </div>

      <div v-else class="text-center text-gray-500 dark:text-gray-400">
        <FontAwesomeIcon icon="fa-solid fa-cloud-arrow-up" class="w-10 h-10 mb-2" />
        <p class="text-sm">Haz clic para subir o arrastra un archivo aquí.</p>
      </div>
    </div>

    <div
      v-if="fileToUpload"
      class="mt-4 p-4 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
    >
      <p class="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
        <FontAwesomeIcon :icon="fileIcon" class="mr-2 text-blue-500" />
        Archivo seleccionado: <span class="font-normal ml-1">{{ fileToUpload.name }}</span>
      </p>
      <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Tipo: {{ fileType }}</p>
      <div class="flex items-center space-x-2">
        <UiButton @click.prevent="uploadSelectedFile" intent="primary" size="sm">
          <FontAwesomeIcon icon="fa-solid fa-upload" class="mr-1" />
          Subir ({{ formatBytes(fileToUpload.size) }})
        </UiButton>
        <UiButton @click.prevent="cancelUpload" intent="secondary" size="sm"> Cancelar </UiButton>
      </div>
    </div>

    <UiAlert v-if="uploadError" intent="danger" title="¡Ups!, Ocurrió un error" class="mt-2">
      <p>{{ uploadError }}</p>
    </UiAlert>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  faCloudArrowUp,
  faXmark,
  faFile,
  faUpload,
  faImage,
  faFilePdf,
} from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import UiSpinner from '@/components/ui/UiSpinner.vue'
import UiAlert from '@/components/ui/UiAlert.vue'
import UiButton from '@/components/ui/UiButton.vue'
import { StorageService } from '@/services/storageService'
import { formatBytes } from '@/utils/formatters'
import { useToast } from '@/composables/useToast'
import { useGlobalModal } from '@/composables/useGlobalModal'
import InfoModal from './modals/InfoModal.vue'

library.add(faCloudArrowUp, faXmark, faFile, faUpload, faImage, faFilePdf)

const props = defineProps({
  modelValue: { type: String, default: null },
  bucketName: { type: String, required: true },
  label: { type: String, default: 'Subir Archivo' },
  folderPath: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  accept: { type: String, default: 'image/*' },
})

const emit = defineEmits(['update:modelValue'])

const $modal = useGlobalModal()
const fileInput = ref<HTMLInputElement | null>(null)
const loading = ref(false)
const uploadError = ref<string | null>(null)
const fileToUpload = ref<File | null>(null)
const toast = useToast()
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

const currentFileUrl = computed(() => {
  if (fileToUpload.value) {
    return URL.createObjectURL(fileToUpload.value)
  }
  return props.modelValue
})

const isImageFile = computed(() => {
  if (!currentFileUrl.value) return false
  const extension = currentFileUrl.value.split('.').pop()?.toLowerCase()
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')
})

const fileType = computed(() => {
  if (!fileToUpload.value) return 'Archivo'
  const type = fileToUpload.value.type
  if (type.startsWith('image/')) return 'Imagen'
  if (type === 'application/pdf') return 'Documento PDF'
  return type || 'Archivo'
})

const fileIcon = computed(() => {
  if (!fileToUpload.value) return ['fas', 'file']
  const type = fileToUpload.value.type
  if (type.startsWith('image/')) return ['fas', 'image']
  if (type === 'application/pdf') return ['fas', 'file-pdf']
  return ['fas', 'file']
})

const getFileName = (url: string) => {
  try {
    const urlObj = new URL(url)
    const path = urlObj.pathname
    return path.split('/').pop()?.split('?')[0] || ''
  } catch {
    return url
  }
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (file.size > MAX_FILE_SIZE) {
    uploadError.value = `El archivo excede el tamaño máximo permitido de ${formatBytes(
      MAX_FILE_SIZE,
    )}.`
    fileToUpload.value = null
    if (fileInput.value) fileInput.value.value = ''
    return
  }

  uploadError.value = null
  fileToUpload.value = file
}

const uploadSelectedFile = async () => {
  console.log('FileUploader: Iniciando subida de archivo.')
  if (!fileToUpload.value) return

  // 1. Mostrar el modal de confirmación antes de la subida
  try {
    const result = await $modal.showModal(
      InfoModal,
      {
        title: 'Confirmación de Subida',
        message: `El archivo "${fileToUpload.value.name}" tiene un tamaño de ${formatBytes(fileToUpload.value.size)}. ¿Deseas continuar con la subida?`,
        confirmText: 'Subir',
        cancelText: 'Cancelar',
      },
      { closeOnClickOutside: false },
    )

    if (result.action === 'confirm') {
      console.log('modal Info Fileupload confirm!.')
    }
    // 2. Si el usuario no confirma, detenemos el proceso
    if (result.action === 'cancel') {
      cancelUpload()
      toast.info('Subida cancelada.')
      return
    }
  } catch (error) {
    console.error('Error al mostrar el modal de confirmación:', error)
    toast.error('Ocurrió un error al intentar subir el archivo.')
    return
  }

  // 3. Si el usuario confirmó, continuamos con la lógica de subida existente

  loading.value = true
  try {
    const publicUrl = await StorageService.uploadFile(
      props.bucketName,
      fileToUpload.value,
      props.folderPath,
    )
    console.log('FileUploader: Archivo subido con éxito. Emitiendo update:modelValue.')

    emit('update:modelValue', publicUrl)
    toast.success('Archivo subido con éxito.')
    fileToUpload.value = null
  } catch (error: any) {
    console.error('Error al subir el archivo:', error)
    uploadError.value = error.message || 'Ocurrió un error al subir el archivo.'
    toast.error('Error al subir el archivo. Inténtalo de nuevo.')
  } finally {
    loading.value = false
    if (fileInput.value) {
      fileInput.value.value = ''
    }
    console.log('FileUploader: Proceso de subida de archivo finalizado.')
  }
}

const cancelUpload = () => {
  fileToUpload.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const removeFile = () => {
  if (!props.modelValue) return
  emit('update:modelValue', null)
  toast.warning('Archivo eliminado de forma local.')
}

// Watcher para limpiar el archivo cuando la URL del modelo cambia
watch(
  () => props.modelValue,
  (newValue) => {
    // Si la nueva URL es diferente de la URL del archivo seleccionado,
    // significa que el archivo ya se subió y podemos limpiar el estado local.
    if (newValue && fileToUpload.value) {
      fileToUpload.value = null
    }
  },
)
</script>

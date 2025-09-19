<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold dark:text-gray-100">Gestión de Archivos</h2>
      <UiButton @click="fileInput?.click()" intent="primary">Subir Archivo</UiButton>
    </div>

    <div class="mb-6 flex flex-col sm:flex-row gap-4 items-center">
      <div class="flex-grow">
        <UiSelect
          id="bucket-select"
          label="Seleccionar Bucket"
          :options="bucketOptions"
          v-model="selectedBucket"
        />
      </div>
    </div>

    <input
      type="file"
      ref="fileInput"
      class="hidden"
      @change="handleFileChange"
      :accept="fileAccept"
    />

    <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 min-h-[50vh]">
      <div v-if="loading" class="text-center text-gray-500 dark:text-gray-400 py-10">
        <UiSpinner class="mx-auto w-8 h-8" />
        <p class="mt-2">Cargando archivos...</p>
      </div>
      <UiAlert v-else-if="hasError" type="error" class="py-10">
        <p class="text-center font-bold">Error al cargar los archivos.</p>
      </UiAlert>
      <div v-else-if="!files.length" class="text-center text-gray-500 dark:text-gray-400 py-10">
        No hay archivos en este bucket.
      </div>
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div
          v-for="file in files"
          :key="file.id"
          class="relative group rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <img
            v-if="isImage(file.name)"
            :src="file.publicUrl"
            :alt="file.name"
            class="object-cover w-full h-32 md:h-40 lg:h-48 transition-transform duration-300 group-hover:scale-105"
          />
          <div
            v-else
            class="flex items-center justify-center bg-gray-200 dark:bg-gray-700 w-full h-32 md:h-40 lg:h-48"
          >
            <FontAwesomeIcon icon="fa-solid fa-file" class="text-5xl text-gray-500" />
          </div>

          <div
            class="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <p class="text-white text-xs truncate mb-2">{{ file.name }}</p>
            <div class="flex gap-2">
              <UiButton
                @click="copyToClipboard(file.publicUrl)"
                size="sm"
                intent="secondary"
                class="flex-1"
                title="Copiar URL"
              >
                <FontAwesomeIcon icon="fa-solid fa-copy" />
              </UiButton>
              <UiButton @click="handleDeleteFile(file)" size="sm" intent="danger" class="flex-1">
                <FontAwesomeIcon icon="fa-solid fa-trash" />
              </UiButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { faCopy, faTrash, faFile, faFolderOpen, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import UiButton from '@/components/ui/UiButton.vue'
import UiSelect from '@/components/ui/UiSelect.vue'
import UiSpinner from '@/components/ui/UiSpinner.vue'
import { StorageService } from '@/services/storageService'
import { useToastStore } from '@/stores/toast'
import { useGlobalModal } from '@/composables/useGlobalModal'
import ConfirmDeleteModal from '@/components/ui/modals/ConfirmDeleteModal.vue'
import supabase from '@/lib/supabaseClient'
import UiAlert from '@/components/ui/UiAlert.vue'

library.add(faCopy, faTrash, faFile, faFolderOpen, faSpinner)

// Opciones para el selector de buckets
const bucketOptions = [
  // Usa las variables de entorno para los valores
  { value: import.meta.env.VITE_SUPABASE_PROJECTS_BUCKET, label: 'Proyectos' },
  { value: import.meta.env.VITE_SUPABASE_ICONS_BUCKET, label: 'Íconos de Tecnologías' },
  { value: import.meta.env.VITE_SUPABASE_AVATARS_BUCKET, label: 'Avatares' },
  { value: import.meta.env.VITE_SUPABASE_CVS_BUCKET, label: 'CVs' },
]
// Estado del componente
const selectedBucket = ref(bucketOptions[0].value)
const files = ref<any[]>([])
const loading = ref(false)
const hasError = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const toastStore = useToastStore()
const modal = useGlobalModal()

// Tipos de archivo permitidos para cada bucket
const fileAccept = computed(() => {
  if (selectedBucket.value === 'avatars') return 'image/jpeg,image/png'
  if (selectedBucket.value === 'icons') return 'image/svg+xml,image/png'
  return 'image/*'
})

const isImage = (fileName: string): boolean => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp']
  const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'))
  return imageExtensions.includes(extension)
}

// Función para obtener la URL pública de un archivo
const getPublicUrl = (path: string) => {
  const { data } = supabase.storage.from(selectedBucket.value).getPublicUrl(path)
  return data.publicUrl
}

// Función para cargar los archivos del bucket seleccionado
const fetchFiles = async () => {
  loading.value = true
  hasError.value = false
  files.value = []
  try {
    const { data, error } = await supabase.storage.from(selectedBucket.value).list()
    if (error) throw error

    // Obtener la URL pública para cada archivo
    files.value = data.map((file) => ({
      ...file,
      publicUrl: getPublicUrl(file.name),
    }))
  } catch (error) {
    hasError.value = true
    toastStore.addToast({ message: 'Error al cargar los archivos.', type: 'error' })
    console.error('Error fetching files:', error)
  } finally {
    loading.value = false
  }
}

// Función para manejar la subida de un nuevo archivo
const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  loading.value = true
  try {
    const publicUrl = await StorageService.uploadFile(selectedBucket.value, file)
    toastStore.addToast({ message: 'Archivo subido con éxito.', type: 'success' })
    await fetchFiles() // Recargamos la lista
  } catch (error) {
    toastStore.addToast({ message: 'Error al subir el archivo.', type: 'error' })
    console.error('Error uploading file:', error)
  } finally {
    loading.value = false
    // Limpiamos el input para que se pueda subir el mismo archivo de nuevo
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

// Función para eliminar un archivo
const handleDeleteFile = async (file: any) => {
  const result = await modal.showModal(
    ConfirmDeleteModal,
    { itemId: file.name, title: file.name }, // Usamos file.name como itemId
    {},
  )

  if (result?.action === 'confirm') {
    try {
      // Usamos directamente el nombre del archivo para la eliminación
      await StorageService.deleteFile(selectedBucket.value, file.name)
      await fetchFiles()
      toastStore.addToast({ message: 'Archivo eliminado con éxito.', type: 'success' })
    } catch (error) {
      toastStore.addToast({ message: 'Error al eliminar el archivo.', type: 'error' })
      console.error('Error deleting file:', error)
    }
  }
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    toastStore.addToast({ message: 'URL copiada al portapapeles.', type: 'success' })
  } catch (error) {
    toastStore.addToast({ message: 'Error al copiar la URL.', type: 'error' })
  }
}

// Observamos el cambio de bucket para recargar los archivos
watch(selectedBucket, fetchFiles)

// Al montar el componente, cargamos los archivos iniciales
onMounted(() => {
  fetchFiles()
})
</script>

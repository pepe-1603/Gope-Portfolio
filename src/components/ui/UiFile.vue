<!--src/componentss/ui/UiFile-->
<template>
  <div class="space-y-1">
    <label v-if="props.label" class="text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ props.label }}
    </label>
    <div
      class="flex items-center justify-between rounded-md border border-gray-300 bg-white p-2 transition-colors duration-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
      :class="[hasFiles ? 'border-blue-500' : '']"
    >
      <span class="text-sm mr-2">
        {{ hasFiles ? fileNames : placeholder }}
      </span>
      <label :for="id" class="cursor-pointer">
        <input
          :id="id"
          type="file"
          :accept="accept"
          :multiple="multiple"
          class="hidden"
          @change="handleFileChange"
        />
        <span
          class="inline-flex items-center rounded-md border px-3 py-1 text-sm font-medium transition-colors duration-200"
          :class="[
            'border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
          ]"
        >
          {{ hasFiles ? 'Cambiar archivo' : 'Seleccionar archivo' }}
        </span>
      </label>
    </div>
    <p v-if="errorMessage" class="text-xs text-red-500">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    label?: string
    id: string
    placeholder?: string
    accept?: string
    multiple?: boolean
    errorMessage?: string
  }>(),
  {
    placeholder: 'Ningún archivo seleccionado',
    multiple: false,
  },
)

const emit = defineEmits(['update:modelValue'])

const files = ref<FileList | null>(null)

const hasFiles = computed(() => files.value && files.value.length > 0)

const fileNames = computed(() => {
  if (!files.value) return ''
  return Array.from(files.value)
    .map((file) => file.name)
    .join(', ')
})

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  files.value = target.files
  emit('update:modelValue', files.value)
}
</script>

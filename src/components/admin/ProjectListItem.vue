<script setup lang="ts">
import UiButton from '@/components/ui/UiButton.vue'
import UiDropdown from '@/components/ui/UiDropdown.vue'
import type { Tables } from '@/types/supabase'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faPen,
  faTrash,
  faArrowUpRightFromSquare,
  faFolderOpen,
} from '@fortawesome/free-solid-svg-icons'
import { MenuItem } from '@headlessui/vue'
import { EllipsisVerticalIcon } from '@heroicons/vue/20/solid'
import { useToast } from '@/composables/useToast'

library.add(faPen, faTrash, faArrowUpRightFromSquare, faFolderOpen)

const props = defineProps<{
  project: Tables<'projects'>
  // ✅ NUEVA PROP para la vista
  isGridItem?: boolean
}>()

const emit = defineEmits(['edit', 'delete', 'preview', 'move'])
const toast = useToast()

// Lógica simulada para el botón 'Mover'
const handleMove = () => {
  toast.upcoming("Función 'Mover' en desarrollo. Mantente atento a las próximas actualizaciones.")

  emit('move', props.project.id)
}
</script>

<template>
  <li
    class="bg-white hover:bg-gray-50 dark:bg-gray-800 hover:dark:shadow-gray-800 rounded-lg shadow transition-shadow ease-linear p-4"
    :class="{
      'flex justify-between items-center gap-x-6': !isGridItem,
      'flex flex-col items-center justify-center text-center': isGridItem,
    }"
  >
    <div class="flex min-w-0 gap-x-4" :class="{ 'flex-col items-center': isGridItem }">
      <img
        :src="project.image_url || 'https://via.placeholder.com/150'"
        :alt="`Imagen del proyecto ${project.title}`"
        class="rounded-lg object-cover object-center shadow-lg transition-all duration-300 hover:saturate-50"
        :class="{
          'size-16 md:size-24 md:w-36 lg:size-28 lg:w-48': !isGridItem,
          'w-full max-h-[160px]': isGridItem,
        }"
      />
      <div class="block space-y-1 mt-2">
        <p
          class="font-semibold text-blue-600 dark:text-blue-700"
          :class="{ 'text-sm md:text-base': !isGridItem, 'text-lg': isGridItem }"
        >
          {{ project.title }}
        </p>
        <p
          class="font-semibold text-sm md:text-base text-gray-900 dark:text-white"
          :class="{ 'text-xs md:text-sm': isGridItem }"
        >
          {{ project.summary }}
        </p>
      </div>
    </div>

    <div
      class="p-1 sm:p-2 min-w-fit flex justify-between items-center"
      :class="{
        'mt-4': isGridItem,
        'mt-0': !isGridItem,
      }"
    >
      <div class="flex items-center space-x-2">
        <UiButton @click="emit('preview', project.slug)" intent="secondary" size="sm">
          <FontAwesomeIcon icon="fa-solid fa-arrow-up-right-from-square" class="mr-1" /> Preview
        </UiButton>

        <UiDropdown>
          <template #trigger>
            <UiButton size="sm" intent="tertiary" class="ml-auto flex-none">
              <EllipsisVerticalIcon class="h-5 w-5" />
            </UiButton>
          </template>
          <template #items>
            <MenuItem v-slot="{ active }">
              <button
                :class="[
                  active ? 'bg-gray-100 dark:bg-gray-700' : '',
                  'block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200',
                ]"
                @click="emit('edit', project.slug)"
              >
                <FontAwesomeIcon icon="fa-solid fa-pen" class="mr-2" /> Editar
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <button
                :class="[
                  active ? 'bg-gray-100 dark:bg-gray-700' : '',
                  'block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200',
                ]"
                @click="handleMove"
              >
                <FontAwesomeIcon icon="fa-solid fa-folder-open" class="mr-2" /> Mover
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <button
                :class="[
                  active
                    ? 'bg-gray-100 dark:bg-gray-700 text-red-600 dark:text-red-400'
                    : 'text-red-600 dark:text-red-400',
                  'block w-full text-left px-4 py-2 text-sm',
                ]"
                @click="emit('delete', project.id, project.title)"
              >
                <FontAwesomeIcon icon="fa-solid fa-trash" class="mr-2" /> Eliminar
              </button>
            </MenuItem>
          </template>
        </UiDropdown>
      </div>
    </div>
  </li>
</template>

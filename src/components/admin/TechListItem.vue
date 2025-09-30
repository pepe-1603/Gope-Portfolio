<script setup lang="ts">
import UiButton from '@/components/ui/UiButton.vue'
import UiDropdown from '@/components/ui/UiDropdown.vue'
import type { Tables } from '@/types/supabase'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEye, faPen, faTrash, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { MenuItem } from '@headlessui/vue'
import { EllipsisVerticalIcon } from '@heroicons/vue/20/solid'

library.add(faEye, faPen, faTrash, faChevronDown)

defineProps<{
  tech: Tables<'techs'>
  techDescription?: string
  // ✅ NUEVA PROP para la vista
  isGridItem?: boolean
}>()

const emit = defineEmits(['edit', 'delete', 'view'])
</script>

<template>
  <li
    class="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md shadow-sm transition-colors duration-200 p-4"
    :class="{
      'flex justify-between items-center gap-x-6': !isGridItem,
      'flex flex-col items-center justify-center text-center': isGridItem,
    }"
  >
    <div class="flex min-w-0 gap-x-4" :class="{ 'flex-col items-center': isGridItem }">
      <img
        :src="tech.icon_url || 'https://via.placeholder.com/50'"
        :alt="`Ícono de ${tech.name}`"
        class="size-16 flex-none rounded-full object-scale-down object-center"
        :class="{
          'mb-2': isGridItem,
          'size-16': !isGridItem,
          'size-24': isGridItem,
        }"
      />
      <div class="min-w-0 flex-auto">
        <h4 class="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">
          {{ tech.name }}
        </h4>
        <p
          v-if="techDescription"
          class="mt-1 truncate text-xs leading-5 text-gray-500 whitespace-break-spaces"
        >
          {{ techDescription }}
        </p>
      </div>
    </div>

    <div
      class="flex items-center space-x-2"
      :class="{
        'mt-4': isGridItem,
        'mt-0': !isGridItem,
      }"
    >
      <UiButton @click="emit('view', tech)" intent="info" size="sm" class="rounded-full text-xs">
        <FontAwesomeIcon icon="fa-solid fa-eye" class="mr-1" /> Ver
      </UiButton>

      <UiDropdown>
        <template #trigger>
          <UiButton size="sm" intent="tertiary" class="ml-auto flex-none">
            <EllipsisVerticalIcon class="w-5 h-5" />
          </UiButton>
        </template>
        <template #items>
          <MenuItem v-slot="{ active }">
            <button
              :class="[
                active ? 'bg-gray-100 dark:bg-gray-700' : '',
                'block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200',
              ]"
              @click="emit('edit', tech)"
            >
              <FontAwesomeIcon icon="fa-solid fa-pen" class="mr-2" /> Editar
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
              @click="emit('delete', tech.id, tech.name)"
            >
              <FontAwesomeIcon icon="fa-solid fa-trash" class="mr-2" /> Eliminar
            </button>
          </MenuItem>
        </template>
      </UiDropdown>
    </div>
  </li>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { format, formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  faBuilding,
  faChevronDown,
  faEllipsisV,
  faPencilAlt,
  faTrash,
  faLink,
  faListCheck,
} from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import UiButton from '@/components/ui/UiButton.vue'
import UiBadge from '@/components/ui/UiBadge.vue'
import UiDropdown from '@/components/ui/UiDropdown.vue'
import type { Tables } from '@/types/supabase'
import { projectService } from '@/services/projectService'
import type { ProjectWithTechs } from '@/types/project'
// Importa MenuItem de Headless UI
import { MenuItem } from '@headlessui/vue'

library.add(faBuilding, faChevronDown, faEllipsisV, faPencilAlt, faTrash, faLink, faListCheck)

const props = defineProps<{
  experience: Tables<'work_experience'>
}>()

const emit = defineEmits(['edit', 'delete'])

const isExpanded = ref(false)
const linkedProject = ref<ProjectWithTechs | null>(null)

const chevronIcon = computed(() =>
  isExpanded.value ? 'fa-solid fa-chevron-down' : 'fa-solid fa-chevron-down',
)

const timeElapsed = computed(() => {
  if (!props.experience.start_date) return ''
  return formatDistanceToNow(new Date(props.experience.start_date), {
    addSuffix: true,
    locale: es,
  })
})

const formattedDate = computed(() => {
  const startDate = new Date(props.experience.start_date || '')
  const endDate = props.experience.end_date ? new Date(props.experience.end_date) : null

  const startFormatted = format(startDate, 'MMM yyyy', { locale: es })
  const endFormatted = endDate ? format(endDate, 'MMM yyyy', { locale: es }) : 'Presente'

  return `${startFormatted} - ${endFormatted}`
})

const fetchLinkedProject = async () => {
  if (props.experience.project_id && !linkedProject.value) {
    try {
      const project = await projectService.getProjectById(props.experience.project_id)
      if (project) {
        linkedProject.value = project
      }
    } catch (error) {
      console.error('Error fetching linked project:', error)
    }
  }
}

const toggleExpand = async () => {
  isExpanded.value = !isExpanded.value
  if (isExpanded.value) {
    await fetchLinkedProject()
  }
}
</script>

<template>
  <div
    class="relative border border-gray-200 dark:border-gray-700 rounded-lg overflow transition-all duration-300 ease-in-out"
    :class="{ 'shadow-lg': isExpanded }"
  >
    <div
      class="flex justify-between items-center px-4 py-4 cursor-pointer"
      :class="{
        'border-b border-gray-200 dark:border-gray-700': isExpanded,
      }"
      @click="toggleExpand"
    >
      <div class="flex items-center gap-4 min-w-0">
        <div
          class="size-9 flex-none rounded-full shadow bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400"
        >
          <font-awesome-icon :icon="faBuilding" class="size-6" />
        </div>
        <div class="flex-auto">
          <p class="font-semibold text-gray-900 dark:text-white truncate">
            {{ experience.company }}
          </p>
          <p class="mt-1 text-sm leading-5 text-gray-500 dark:text-gray-400 truncate">
            {{ experience.role }}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
          {{ timeElapsed }}
        </span>
        <font-awesome-icon
          :icon="chevronIcon"
          class="transition-transform duration-300"
          :class="{ 'rotate-180': isExpanded }"
        />
      </div>
    </div>

    <div v-show="isExpanded" class="px-4 py-4 space-y-4">
      <div class="flex justify-between items-start">
        <div class="flex-auto">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">**{{ formattedDate }}**</p>
          <p
            v-if="experience.description"
            class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap"
          >
            {{ experience.description }}
          </p>
        </div>

        <UiDropdown>
          <template #trigger>
            <UiButton size="sm" intent="tertiary" class="ml-auto flex-none">
              <font-awesome-icon :icon="faEllipsisV" />
            </UiButton>
          </template>
          <template #items>
            <MenuItem v-slot="{ active }">
              <button
                :class="[
                  active ? 'bg-gray-100 dark:bg-gray-700' : '',
                  'block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200',
                ]"
                @click.stop="emit('edit', experience)"
              >
                <font-awesome-icon :icon="faPencilAlt" class="mr-2" />
                <span>Editar</span>
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <button
                :class="[
                  active ? 'bg-gray-100 dark:bg-gray-700' : '',
                  'block w-full text-left px-4 py-2 text-sm',
                  'text-red-600 dark:text-red-400',
                ]"
                @click.stop="emit('delete', experience.id, experience.company)"
              >
                <font-awesome-icon :icon="faTrash" class="mr-2" />
                <span>Eliminar</span>
              </button>
            </MenuItem>
          </template>
        </UiDropdown>
      </div>

      <div v-if="experience.project_id" class="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h5 class="text-xs uppercase font-bold text-gray-500 dark:text-gray-400 mb-2">
          Proyecto Relacionado
        </h5>
        <div
          v-if="linkedProject"
          class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md"
        >
          <div class="size-8 flex-none rounded-md overflow-hidden">
            <img
              v-if="linkedProject.image_url"
              :src="linkedProject.image_url"
              :alt="linkedProject.title"
              class="w-full h-full object-cover"
            />
            <div
              v-else
              class="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400"
            >
              <font-awesome-icon :icon="faLink" />
            </div>
          </div>
          <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
            {{ linkedProject.title }}
          </p>
          <UiBadge v-if="linkedProject.is_published" text="Público" color="green" />
          <UiBadge v-else text="Privado" color="orange" />
        </div>
        <div v-else class="text-sm text-gray-500 dark:text-gray-400">Cargando proyecto...</div>
      </div>
    </div>
  </div>
</template>

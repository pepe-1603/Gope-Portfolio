<template>
  <router-link :to="`/proyectos/${project.slug}`">
    <UiCard class="hover:shadow-lg transition-shadow duration-300">
      <img
        v-if="props.project.image_url"
        :src="props.project.image_url"
        :alt="`Imagen del proyecto ${project.title}`"
        class="w-full min-h-36 md:h-48 lg:h-52 object-cover rounded-t-lg"
      />
      <div
        v-else
        class="w-full min-h-64 max-h-80 flex items-center justify-center rounded-lg mb-6 shadow-md bg-gray-100 dark:bg-gray-800"
      >
        <div class="text-center text-gray-400 dark:text-gray-500">
          <FontAwesomeIcon icon="fas fa-image" class="size-14" />
          <span class="block mt-2">No se ha proporcionado una imagen para este proyecto.</span>
        </div>
      </div>

      <div class="p-4">
        <h2 class="text-xl font-semibold mb-2">{{ project.title }}</h2>
        <p class="text-gray-600 dark:text-gray-400 line-clamp-2 break-all">
          {{ project.description }}
        </p>
        <div class="mt-4 flex flex-wrap gap-2">
          <UiBadge
            v-for="tech in props.project.project_techs"
            :key="tech.techs.id"
            :icon="tech.techs.icon_url"
            :text="tech.techs.name"
            :color="getTechColor(tech.techs.name)"
          ></UiBadge>
        </div>
      </div>
    </UiCard>
  </router-link>
</template>

<script setup lang="ts" name="ProjectCard">
import UiCard from '@/components/ui/UiCard.vue'
import UiBadge from '@/components/ui/UiBadge.vue'
import type { ProjectWithTechs } from '@/types/project'
import type { PropType } from 'vue'
import { getTechColor } from '@/utils/badgeStyles'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faImage } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faImage)

const props = defineProps({
  project: {
    type: Object as PropType<ProjectWithTechs>,
    required: true,
  },
})
</script>

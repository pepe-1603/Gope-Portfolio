<template>
  <section class="max-w-4xl mx-auto px-6 py-12" v-if="project">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
      {{ project.title }}
    </h1>
    <img
      v-if="project.image_url"
      :src="project.image_url"
      :alt="project.title"
      class="w-full h-64 object-cover rounded-lg mb-6 shadow-md"
    />

    <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed font-semibold">
      {{ project.summary }}
    </p>

    <UiCollapsible title="Ver descripción completa" class="my-6">
      <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
        {{ project.description }}
      </p>
    </UiCollapsible>

    <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">Tecnologías usadas</h2>
    <div class="flex flex-wrap gap-2">
      <UiBadge
        v-for="techData in project.project_technologies"
        :key="techData.id"
        :text="techData.name"
        :color="getTechColor(techData.name)"
        :icon="techData.icon_url"
      />
    </div>

    <div class="mt-8 flex gap-4">
      <a
        v-if="project.live_url"
        :href="project.live_url"
        target="_blank"
        class="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:underline"
      >
        <font-awesome-icon :icon="faLink" /> Ver Proyecto
      </a>
      <a
        v-if="project.repo_url"
        :href="project.repo_url"
        target="_blank"
        class="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-medium hover:underline"
      >
        <font-awesome-icon :icon="faGithub" /> Repositorio
      </a>
    </div>
  </section>

  <ProjectDetailSkeleton v-else />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { projectService } from '@/services/projectService.js'
import UiBadge from '@/components/ui/UiBadge.vue'
import ProjectDetailSkeleton from '@/components/ui/skeletons/ProjectDetailSkeleton.vue'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { getTechColor } from '@/utils/badgeStyles'
import UiCollapsible from '@/components/ui/UiCollapsible.vue'

import { library } from '@fortawesome/fontawesome-svg-core'

library.add(faGithub, faLink)

const route = useRoute()
const project = ref(null)

onMounted(async () => {
  try {
    project.value = await projectService.getProjectBySlug(route.params.slug)
  } catch (err) {
    console.error('Error cargando proyecto:', err)
  }
})
</script>

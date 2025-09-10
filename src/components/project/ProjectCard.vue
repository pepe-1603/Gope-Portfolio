<template>
  <router-link :to="`/proyectos/${project.slug}`">
    <UiCard class="hover:shadow-lg transition-shadow duration-300">
      <img
        :src="props.project.image_url"
        :alt="`Imagen del proyecto ${project.title}`"
        class="w-full min-h-36 md:h-48 lg:h-52 object-cover rounded-t-lg"
      />
      <div class="p-4">
        <h2 class="text-xl font-semibold mb-2">{{ project.title }}</h2>
        <p class="text-gray-600 dark:text-gray-400 line-clamp-2">{{ project.description }}</p>
        <div class="mt-4 flex flex-wrap gap-2">
          <UiBadge v-for="tech in props.project.tech_stack" :key="tech" :text="tech"></UiBadge>
        </div>
      </div>
    </UiCard>
  </router-link>
</template>

<script setup lang="ts">
import UiCard from '@/components/ui/UiCard.vue'
import UiBadge from '@/components/ui/UiBadge.vue'

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
})

console.log(props.project)
</script>

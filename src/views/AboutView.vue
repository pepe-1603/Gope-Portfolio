<template>
  <section class="max-w-4xl mx-auto px-6 py-12">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Sobre mí</h1>
    <div class="flex flex-col md:flex-row gap-8">
      <!-- Imagen o avatar -->
      <img
        src="../assets/logo.svg"
        alt="Avatar"
        class="w-32 h-32 rounded-full object-cover mx-auto md:mx-0"
      />

      <div>
        <p class="text-gray-700 dark:text-gray-300 mb-4">
          Soy un desarrollador apasionado por el frontend y el backend. Me encanta construir
          productos funcionales, rápidos y accesibles usando tecnologías modernas como Vue, Supabase
          y Tailwind.
        </p>

        <h2 class="text-xl font-semibold text-gray-800 dark:text-white mt-6 mb-2">Tecnologías</h2>
        <ul class="flex flex-wrap gap-3 text-sm">
          <li
            v-for="tech in tech_stack"
            :key="tech.id"
            class="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
          >
            {{ tech.name }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { techService } from '@/services/techService.js'

const techs = ref([])

onMounted(async () => {
  try {
    techs.value = await techService.getAllTechs()
  } catch (err) {
    console.error('Error al obtener tecnologías:', err)
  }
})
</script>

<!-- src/views/admin/TechPreviewView.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { techService } from '@/services/techService'
import UiAlert from '@/components/ui/UiAlert.vue'
import TechDetailSkeleton from '@/components/ui/skeletons/TechDetailSkeleton.vue'
import type { Tables } from '@/types/supabase'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTag, faCalendarPlus, faClockRotateLeft, faLink } from '@fortawesome/free-solid-svg-icons'

// Agrega los íconos necesarios a la biblioteca
library.add(faTag, faCalendarPlus, faClockRotateLeft, faLink)

const route = useRoute()
const errorFetch = ref<string | null>(null)
const tech = ref<Tables<'techs'> | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const techId = route.params.id as string

    // Si la ruta no tiene un ID, mostramos un error
    if (!techId) {
      errorFetch.value = 'ID de tecnología no proporcionado.'
      return
    }

    const fetchedTech = await techService.getTechById(techId)

    if (fetchedTech) {
      tech.value = fetchedTech
      console.log('Tecnología cargada:', fetchedTech)
    } else {
      errorFetch.value = 'Tecnología no encontrada.'
    }
  } catch (err) {
    console.error('Error cargando tecnología:', err)
    errorFetch.value = 'No se pudo cargar la tecnología o no tienes permisos.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="p-6">
    <div v-if="errorFetch" class="mt-8 container mx-auto p-6">
      <UiAlert intent="danger" title="Error" :description="errorFetch" dismissible />
    </div>

    <section v-else-if="tech" class="container mx-auto px-6 py-12">
      <div class="text-center mb-10">
        <img
          :src="tech.icon_url || 'https://via.placeholder.com/150'"
          :alt="`Ícono de ${tech.name}`"
          class="size-32 md:size-48 mx-auto mb-4 object-contain rounded-full shadow-lg"
        />
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {{ tech.name }}
        </h1>
      </div>

      <div class="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-inner">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Detalles de la Tecnología
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 dark:text-gray-300">
          <p class="flex items-center gap-2">
            <font-awesome-icon icon="fa-solid fa-tag" class="text-blue-500" />
            <strong class="font-medium text-gray-800 dark:text-gray-100">ID:</strong>
            {{ tech.id }}
          </p>
          <p v-if="tech.icon_url" class="flex items-center gap-2">
            <font-awesome-icon icon="fa-solid fa-link" class="text-blue-500" />
            <strong class="font-medium text-gray-800 dark:text-gray-100">URL del Ícono:</strong>
            <a
              :href="tech.icon_url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-600 dark:text-blue-400 text-sm underline text-wrap break-all break-words"
              >{{ tech.icon_url }}</a
            >
          </p>
          <p v-if="tech.created_at" class="flex items-center gap-2">
            <font-awesome-icon icon="fa-solid fa-calendar-plus" class="text-green-500" />
            <strong class="font-medium text-gray-800 dark:text-gray-100">Creado en:</strong>
            {{ new Date(tech.created_at).toLocaleDateString() }}
          </p>
          <p v-if="tech.updated_at != tech.created_at" class="flex items-center gap-2">
            <font-awesome-icon icon="fa-solid fa-clock-rotate-left" class="text-yellow-500" />
            <strong class="font-medium text-gray-800 dark:text-gray-100"
              >Última actualización:</strong
            >
            {{ new Date(tech.updated_at).toLocaleDateString() }}
          </p>
        </div>
      </div>
    </section>

    <TechDetailSkeleton v-else />
  </div>
</template>

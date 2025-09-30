<template>
  <section class="max-w-4xl mx-auto px-6 py-12">
    <template v-if="loading">
      <SkeletonProfile />
    </template>
    <template v-else-if="profile">
      <div
        class="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 text-center md:text-left"
      >
        <img
          :src="profile.avatar || 'https://via.placeholder.com/150'"
          alt="Avatar"
          class="w-40 h-40 rounded-full object-cover shadow-lg"
        />
        <div>
          <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
            {{ profile.name || 'Sin nombre' }}
          </h1>
          <p class="text-xl font-medium text-gray-700 dark:text-gray-300 mb-4">
            {{ profile.role || 'Rol no definido' }}
          </p>
          <p class="text-gray-600 dark:text-gray-400 max-w-2xl">
            {{ profile.bio || 'Biografía no disponible.' }}
          </p>
        </div>
      </div>

      <div class="mt-12 text-center">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Conéctate conmigo</h2>
        <div class="flex justify-center gap-6">
          <a
            v-if="profile.github_url"
            :href="profile.github_url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
          >
            GitHub
          </a>
          <a
            v-if="profile.linkedin_url"
            :href="profile.linkedin_url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
          >
            LinkedIn
          </a>
          <a
            v-if="profile.cv_url"
            :href="profile.cv_url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
          >
            Descargar CV
          </a>
        </div>
        <p
          v-if="!profile.github_url && !profile.linkedin_url && !profile.cv_url"
          class="text-gray-500 mt-4"
        >
          No hay enlaces de contacto disponibles.
        </p>
      </div>
    </template>
    <template v-else>
      <p class="text-center text-gray-500 dark:text-gray-400">
        Perfil no encontrado.
      </p>
    </template>

    <div class="mt-12 text-center">
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Tecnologías</h2>
      <template v-if="loading">
        <div class="flex flex-wrap justify-center gap-4 text-sm">
          <div
            v-for="n in 6"
            :key="n"
            class="h-8 w-24 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"
          ></div>
        </div>
      </template>
      <template v-else-if="techs && techs.length">
        <div class="flex flex-wrap justify-center gap-4 text-sm">
          <UiBadge
            v-for="techData in techs"
            :key="techData.id"
            :text="techData.name"
            :color="getTechColor(techData.name)"
            :icon="techData.icon_url"
          />
        </div>
      </template>
      <template v-else>
        <p class="text-gray-500 dark:text-gray-400">No hay tecnologías disponibles.</p>
      </template>
    </div>

    <UiDivider label="Experiencia Profesional" />

    <div class="mt-12">
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
        Experiencia Profesional
      </h2>
      <template v-if="loading">
        <SkeletonExperience />
      </template>
      <template v-else-if="experience && experience.length">
        <div class="space-y-8">
          <div
            v-for="job in experience"
            :key="job.id"
            class="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md"
          >
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ job.role }}</h3>
            <p class="text-md text-gray-600 dark:text-gray-400 mb-2">
              {{ job.company }} | {{ formatDate(job.start_date) }} -
              {{ job.end_date ? formatDate(job.end_date) : 'Presente' }}
            </p>
            <p class="text-gray-600 dark:text-gray-400">{{ job.description }}</p>
          </div>
        </div>
      </template>
      <template v-else>
        <p class="text-center text-gray-500 dark:text-gray-400">
          No hay experiencia laboral para mostrar en este momento.
        </p>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { techService } from '@/services/techService.js'
import { profileService } from '@/services/profileService'
import { experienceService } from '@/services/experienceService'
import { getTechColor } from '@/utils/badgeStyles'
import UiBadge from '@/components/ui/UiBadge.vue'
import UiDivider from '@/components/UiDivider.vue'
import SkeletonExperience from '@/components/ui/skeletons/SkeletonExperience.vue'
import SkeletonProfile from '@/components/ui/skeletons/SkeletonProfile.vue'
import type { Tables } from '@/types/supabase'

const loading = ref(true)
const profile = ref<Tables<'user_profiles'> | null>(null)
const techs = ref<Tables<'techs'>[] | null>(null)
const experience = ref<Tables<'work_experience'>[] | null>(null)

const formatDate = (dateString: string | null): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' }
  return date.toLocaleDateString('es-ES', options)
}

onMounted(async () => {
  try {
    const adminUserId = import.meta.env.VITE_ADMIN_UUID

    const [fetchedProfile, fetchedTechs, fetchedExperience] = await Promise.all([
      profileService.getProfileByUserId(adminUserId),
      techService.getAllTechs(),
      experienceService.getAllExperience(),
    ])

    profile.value = fetchedProfile
    techs.value = fetchedTechs
    experience.value = fetchedExperience
  } catch (err) {
    console.error('Error al cargar datos de la vista "Sobre mí":', err)
    profile.value = null
    techs.value = null
    experience.value = null
  } finally {
    loading.value = false
  }
})
</script>

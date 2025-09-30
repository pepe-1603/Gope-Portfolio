<template>
  <!-- Contenedor principal de la landing page -->
  <!-- class="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 dark:from-gray-900 dark:to-black text-white p-4" -->
  <div class="flex items-center justify-center min-h-screen p-4">
    <div v-if="!profilePublic" class="text-2xl animate-pulse">Cargando perfil...</div>
    <div v-else class="max-w-4xl w-full text-center space-y-8 animate-fade-in">
      <!-- Sección de Imagen/Ilustración (Opcional) -->
      <img
        @click="handleAvatarClick"
        :src="profilePublic.avatar || 'https://placehold.co/150x150/ffffff/000000?text=Avatar'"
        :alt="`Foto de Perfil de ${profilePublic.name}`"
        class="w-48 h-48 rounded-full object-cover mx-auto shadow-2xl border-4 border-white transform hover:scale-105 transition-transform duration-300"
      />
      <h1 class="text-5xl md:text-6xl font-extrabold tracking-tight">
        Hola, soy
        <span class="text-yellow-300">{{ profilePublic.name || 'Desarrollador' }} </span>
      </h1>

      <p class="mt-4 text-xl md:text-2xl font-light leading-relaxed">
        Un apasionado
        <span class="font-bold text-blue-300">{{ profilePublic.title || 'Desarrollador' }}</span>
        {{ profilePublic.tagline || 'creando experiencias web increíbles.' }}
      </p>

      <p class="text-lg md:text-xl text-gray-600">
        {{ profilePublic.bio || '¡Bienvenido! Actualiza tu perfil en la base de datos.' }}
      </p>
      <!-- Botones de Call To Action -->
      <div class="mt-10 flex flex-col sm:flex-row justify-center gap-4">
        <router-link to="/proyectos">
          <button
            class="bg-yellow-400 text-gray-900 font-extrabold py-3 px-8 rounded-full shadow-lg hover:bg-yellow-500 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-300/80 flex items-center justify-center gap-2"
          >
            <font-awesome-icon :icon="['fas', 'folder-open']" /> Explora mi Trabajo
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="HomeView">
// src/views/HomeView.vue (o tu componente de perfil público)
import { profileService } from '@/services/profileService'
import { useAuthStore } from '@/stores/authStore'
import type { Tables } from '@/types/supabase' // ✅ Necesitas este tipo
import { library } from '@fortawesome/fontawesome-svg-core'
import { faComments, faFolderOpen, faIdCard } from '@fortawesome/free-solid-svg-icons'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

library.add(faFolderOpen, faIdCard, faComments)
// 🛑 Corrección 1: Usar ref para el perfil y tiparlo.
const profilePublic = ref<Tables<'user_profiles'> | null>(null)

// 🛑 Corrección 2: Definir la variable usando ref o const si es fija.
const adminUuid = ref<string>('')
const router = useRouter()
const authStore = useAuthStore()
const clickCount = ref(0)
let clickTimer: NodeJS.Timeout | null = null

const handleAdminAccess = () => {
  // 1. Si no está logueado, vamos directamente al login. (UX Rápida)
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  // 2. Si está logueado, pero no es admin, redirigimos a home. (UX Discreta)
  // Asumiendo que el rol requerido es 'admin'
  if (authStore.profile?.role !== 'admin') {
    router.push('/')
    return
  }

  // 3. ¡Es Admin y Logueado! Redirigimos al panel.
  router.push('/admin')
}

const handleAvatarClick = () => {
  clickCount.value++

  if (clickTimer) {
    clearTimeout(clickTimer)
  }

  // Define un tiempo de espera (ej: 500ms) para considerar que son clics rápidos
  clickTimer = setTimeout(() => {
    if (clickCount.value === 3) {
      console.log('Triple clic detectado. Redirigiendo a /admin.')
      handleAdminAccess() // ✅ Usar la función que contiene la lógica de seguridad
    }
    // Reiniciar el contador y el temporizador
    clickCount.value = 0
    clickTimer = null
  }, 500)
}

onMounted(async () => {
  // ✅ onMounted debe ser async para usar await dentro.
  adminUuid.value = import.meta.env.VITE_ADMIN_UUID

  if (!adminUuid.value) {
    console.error('VITE_ADMIN_UUID no está definido. No se puede cargar el perfil público.')
    return
  }
  if (import.meta.env.DEV) {
    console.log('Perfil Público ID:', adminUuid)
  }

  try {
    // 🛑 Corrección 3: Llamar al servicio y usar await.
    const data = await profileService.getProfileByUserId(adminUuid.value) // 🛑 Corrección 4: Asignar al valor del ref

    console.log('fecth userProfile: ', data)
    profilePublic.value = data
  } catch (error) {
    console.error('Error al cargar el perfil público:', error)
  }
})
</script>

<style scoped>
/* Animación simple de fade-in para una entrada suave */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fadeIn 1s ease-out forwards;
}
</style>

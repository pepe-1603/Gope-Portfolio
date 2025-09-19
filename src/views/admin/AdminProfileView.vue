<template>
  <div class="p-4 sm:p-6 space-y-6">
    <h2 class="text-2xl font-bold dark:text-gray-100">Mi Perfil</h2>

    <AdminProfileSkeleton v-if="loading" />

    <div v-else-if="hasError" class="mt-8">
      <UiAlert
        intent="danger"
        title="Error"
        description="No se pudo cargar la información del perfil. Por favor, intenta de nuevo más tarde."
      />
    </div>

    <section v-else>
      <AdminProfileForm
        v-if="isEditing"
        @updated="handleProfileUpdated"
        @cancel="handleCancelEdit"
      />
      <div
        v-else
        class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
      >
        <div class="md:col-span-1 flex flex-col items-center text-center">
          <img
            :src="profile?.avatar || 'https://via.placeholder.com/150'"
            alt="Avatar del usuario"
            class="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-blue-500 dark:border-blue-600 transition-transform hover:scale-105"
          />
          <h3 class="mt-4 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {{ profile?.name || 'Nombre no definido' }}
          </h3>
          <p class="text-sm sm:text-md text-blue-600 dark:text-blue-400 font-medium mt-1">
            {{ profile?.role }}
          </p>
          <p class="mt-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {{ profile?.bio || 'Sin biografía.' }}
          </p>
        </div>

        <div class="md:col-span-2">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h4 class="text-xl font-semibold text-gray-800 dark:text-white mb-2 sm:mb-0">
              Detalles
            </h4>
            <UiButton @click="handleEditProfile" intent="primary" size="sm">
              <FontAwesomeIcon icon="fa-solid fa-pen" class="mr-2" />
              Editar
            </UiButton>
          </div>

          <dl class="space-y-4 text-gray-600 dark:text-gray-400">
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Correo Electrónico
              </dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {{ authStore.user?.email }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">GitHub</dt>
              <dd class="mt-1 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                <a :href="profile?.github_url" target="_blank" class="flex items-center gap-2">
                  <font-awesome-icon :icon="['fab', 'github']" />
                  <span>{{ profile?.github_url || 'No especificado' }}</span>
                </a>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">LinkedIn</dt>
              <dd class="mt-1 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                <a :href="profile?.linkedin_url" target="_blank" class="flex items-center gap-2">
                  <font-awesome-icon :icon="['fab', 'linkedin']" />
                  <span>{{ profile?.linkedin_url || 'No especificado' }}</span>
                </a>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Curriculum-Vitae</dt>
              <dd class="mt-1 text-sm text-red-600 dark:text-red-400 hover:underline">
                <a :href="profile?.cv_url" target="_blank" class="flex items-center gap-2">
                  <font-awesome-icon :icon="['fas', 'file-pdf']" />
                  <span>Ver mi CV</span>
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts" name="AdminProfileView">
import { ref, onMounted, computed } from 'vue'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/authStore'
import UiAlert from '@/components/ui/UiAlert.vue'
import UiButton from '@/components/ui/UiButton.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { faFilePdf, faPen } from '@fortawesome/free-solid-svg-icons'
import AdminProfileSkeleton from '@/components/ui/skeletons/AdminProfileSkeleton.vue'
import AdminProfileForm from '@/components/admin/AdminProfileForm.vue'

library.add(faGithub, faLinkedin, faFilePdf, faPen)

const authStore = useAuthStore()
const toast = useToast()
const loading = ref(true)
const hasError = ref(false)
const isEditing = ref(false)

const profile = computed(() => authStore.profile)

onMounted(async () => {
  try {
    loading.value = true
    await authStore.fetchProfile()
    hasError.value = false
  } catch (error) {
    console.error('Error al cargar el perfil:', error)
    hasError.value = true
    toast.error('No se pudo cargar la información del perfil.')
  } finally {
    loading.value = false
  }
})

const handleEditProfile = () => {
  console.log('AdminProfileView: Iniciando modo de edición.')
  isEditing.value = true
}

const handleProfileUpdated = () => {
  console.log('AdminProfileView: Evento @updated recibido. Cerrando formulario.')
  isEditing.value = false
  toast.success('Perfil actualizado con éxito.')
}

const handleCancelEdit = () => {
  console.log('AdminProfileView: Cancelando edición.')
  isEditing.value = false
}
</script>

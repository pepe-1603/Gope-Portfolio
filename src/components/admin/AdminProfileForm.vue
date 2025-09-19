<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 space-y-6">
    <div class="flex items-center justify-between">
      <h4 class="text-xl font-semibold text-gray-800 dark:text-white">Editar Perfil</h4>
      <UiButton @click="$emit('cancel')" intent="secondary" size="sm"> Cancelar </UiButton>
    </div>

    <UiAlert
      v-if="!form.avatar || !form.cv_url"
      title="Completa tu perfil"
      description="Para una mejor experiencia, sube tu foto de perfil y tu currículum vitae."
      intent="info"
    />

    <form class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div>
          <FileUploader
            v-model="form.avatar"
            label="Foto de Perfil"
            :bucket-name="avatars_bucket"
            accept="image/*"
            folder-path="users"
          />
        </div>

        <div>
          <FileUploader
            v-model="form.cv_url"
            label="Curriculum Vitae (PDF)"
            :bucket-name="cvs_bucket"
            folder-path="users"
            accept=".pdf"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <UiFormField
            v-model="form.name"
            label="Nombre Completo"
            placeholder="Introduce tu nombre"
            id="name"
          />
        </div>
        <div>
          <UiFormField
            v-model="form.bio"
            label="Biografía"
            placeholder="Una breve descripción sobre ti"
            id="bio"
          />
        </div>
        <div>
          <UiFormField
            v-model="form.github_url"
            label="GitHub URL"
            placeholder="https://github.com/tuusuario"
            id="github"
          />
        </div>
        <div>
          <UiFormField
            v-model="form.linkedin_url"
            label="LinkedIn URL"
            placeholder="https://linkedin.com/in/tuusuario"
            id="linkedin"
          />
        </div>
      </div>

      <div class="flex justify-end">
        <UiButton
          @click.prevent="saveProfile"
          type="button"
          intent="primary"
          :disabled="isSubmitting"
          :loading="isSubmitting"
        >
          Guardar Cambios
        </UiButton>
      </div>
    </form>

    <UiAlert
      v-if="hasError"
      title="Ocurrió un error"
      :description="hasError"
      intent="danger"
      dismissible
      @dismiss="hasError = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/composables/useToast'
import { profileService } from '@/services/profileService'
import FileUploader from '@/components/ui/FileUploader.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiFormField from '@/components/ui/UiFormField.vue'
import UiAlert from '../ui/UiAlert.vue'
import { useGlobalModal } from '@/composables/useGlobalModal'
import ConfirmUpdateModal from '../ui/modals/ConfirmUpdateModal.vue'

const authStore = useAuthStore()
const $modal = useGlobalModal()
const toast = useToast()
const isSubmitting = ref(false)
const cvs_bucket = ref('')
const avatars_bucket = ref('')
const hasError = ref<string | null>(null)

const form = ref({
  name: '',
  bio: '',
  avatar: '',
  cv_url: '',
  github_url: '',
  linkedin_url: '',
})

onMounted(() => {
  cvs_bucket.value = import.meta.env.VITE_SUPABASE_CVS_BUCKET || ''
  avatars_bucket.value = import.meta.env.VITE_SUPABASE_CVS_BUCKET || ''

  if (authStore.profile) {
    form.value.name = authStore.profile.name || ''
    form.value.bio = authStore.profile.bio || ''
    form.value.avatar = authStore.profile.avatar || ''
    form.value.cv_url = authStore.profile.cv_url || ''
    form.value.github_url = authStore.profile.github_url || ''
    form.value.linkedin_url = authStore.profile.linkedin_url || ''
  }
})

const saveProfile = async () => {
  console.log('AdminProfileForm: Iniciando el proceso de guardado del perfil.')

  // 1. Mostrar el modal de confirmación con los cambios
  try {
    const result = await $modal.showModal(ConfirmUpdateModal, {
      originalData: authStore.profile,
      newData: form.value,
    })
    if (result.action === 'confirm') {
      console.log('modal Info Fileupload confirm!.')
    }

    if (result.action === 'cancel') {
      toast.info(
        'Cambios cancelados por el usuario, realiza los cambios en el form si quieres continuar sino puedes cancelar.',
        5000,
      )
      return
    }
  } catch (error) {
    console.error('Error al mostrar el modal de confirmación:', error)
    toast.error('No se pudo mostrar la confirmación. Inténtalo de nuevo.')
    return
  }

  // 2. Continuar con la lógica de guardado si el usuario confirmó

  hasError.value = null
  isSubmitting.value = true
  try {
    await profileService.updateProfile(form.value)
    await authStore.fetchProfile()
    // Esta es la ÚNICA línea que debe emitir el evento 'updated'
    console.log('AdminProfileForm: Perfil guardado con éxito. Emitiendo @updated.')
    emit('updated')
    toast.success('Perfil actualizado con éxito.')
  } catch (error) {
    console.error('AdminProfileForm: Error al actualizar el perfil:', error)
    console.error('Error al actualizar el perfil:', error)
    hasError.value = 'No se pudieron guardar los cambios. Inténtalo de nuevo.'
    toast.error('Ocurrió un error al guardar los cambios.')
  } finally {
    isSubmitting.value = false
    console.log('AdminProfileForm: Proceso de guardado finalizado.')
  }
}

// Se eliminó la función `handleFileError` ya que los errores se manejarán localmente en FileUploader.
const emit = defineEmits(['updated', 'cancel'])
</script>

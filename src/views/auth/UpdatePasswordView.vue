<template>
  <div class="flex items-center justify-center p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
    <div
      class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl dark:bg-gray-800 transition-all duration-300 transform scale-95 md:scale-100"
    >
      <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white">
        Actualizar Contraseña
      </h2>
      <p class="text-center text-gray-600 dark:text-gray-400">
        Ingresa tu nueva contraseña a continuación.
      </p>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <UiAlert
          v-if="formError"
          intent="danger"
          title="Error al actualizar"
          :description="formError"
          class="mb-4"
        />

        <UiFormField
          id="new-password"
          label="Nueva Contraseña"
          type="password"
          v-model="formData.newPassword"
          :error-message="errors.newPassword"
        >
          <template #icon>
            <font-awesome-icon :icon="['fas', 'key']" class="h-4 w-4 text-gray-400" />
          </template>
        </UiFormField>

        <UiFormField
          id="confirm-password"
          label="Confirmar Contraseña"
          type="password"
          v-model="formData.confirmPassword"
          :error-message="errors.confirmPassword"
        >
          <template #icon>
            <font-awesome-icon :icon="['fas', 'key']" class="h-4 w-4 text-gray-400" />
          </template>
        </UiFormField>

        <div class="pt-4">
          <UiButton type="submit" class="w-full" :disabled="isLoading">
            <span v-if="isLoading" class="flex items-center gap-2 justify-center">
              <font-awesome-icon :icon="['fas', 'spinner']" spin />
              Guardando...
            </span>
            <span v-else>Guardar Cambios</span>
          </UiButton>
        </div>
      </form>
      <div class="text-sm text-center">
        <RouterLink
          to="/auth"
          class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          Volver al inicio de sesión
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="UpdatePasswordView">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { userService } from '@/services/userService'
import UiButton from '@/components/ui/UiButton.vue'
import UiFormField from '@/components/ui/UiFormField.vue'
import UiAlert from '@/components/ui/UiAlert.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faKey, faSpinner } from '@fortawesome/free-solid-svg-icons'

library.add(faKey, faSpinner)

const router = useRouter()
const toast = useToast()
const isLoading = ref(false)
const formError = ref('')

const formData = reactive({
  newPassword: '',
  confirmPassword: '',
})

const errors = reactive({
  newPassword: '',
  confirmPassword: '',
})

const validateForm = () => {
  formError.value = ''
  errors.newPassword = ''
  errors.confirmPassword = ''
  let isValid = true

  if (!formData.newPassword) {
    errors.newPassword = 'La nueva contraseña es requerida.'
    isValid = false
  } else if (formData.newPassword.length < 6) {
    errors.newPassword = 'La contraseña debe tener al menos 6 caracteres.'
    isValid = false
  }
  if (formData.newPassword !== formData.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden.'
    isValid = false
  }
  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    formError.value = 'Por favor, corrige los errores del formulario.'
    return
  }

  isLoading.value = true
  formError.value = ''

  try {
    const user = await userService.changePassword(formData.newPassword)

    if (user) {
      toast.success('Contraseña actualizada con éxito. ¡Inicia sesión con tu nueva contraseña!')
      router.push({ name: 'login' })
    } else {
      formError.value = 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.'
      toast.error(formError.value)
    }
  } catch (error: any) {
    console.error('Error al actualizar la contraseña:', error)
    const message =
      error.message ||
      'Error al actualizar la contraseña. Por favor, verifica el enlace e inténtalo de nuevo.'
    formError.value = message
    toast.error(message)
  } finally {
    isLoading.value = false
  }
}
</script>

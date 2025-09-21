<template>
  <UiAlert
    v-if="!userVerified"
    intent="warning"
    title="Verificación de Correo Pendiente"
    class="mb-4"
  >
    <p class="text-gray-700 dark:text-gray-300">
      Tu dirección de correo electrónico no ha sido verificada. Es importante para la seguridad de
      tu cuenta.
    </p>
    <div class="mt-4 flex items-center justify-between gap-4">
      <p class="text-sm font-medium text-gray-600 dark:text-gray-400">¿No recibiste el correo?</p>
      <UiButton intent="info" size="sm" @click="handleResendVerification" :disabled="isResending">
        <span v-if="isResending" class="flex items-center gap-2">
          <font-awesome-icon :icon="['fas', 'spinner']" spin />
          Enviando...
        </span>
        <span v-else>Reenviar Correo</span>
      </UiButton>
    </div>
  </UiAlert>

  <UiAlert v-else intent="success" title="Correo Electrónico Verificado" dismissible class="mb-4">
    <p class="text-gray-700 dark:text-gray-300">
      Tu dirección de correo electrónico ha sido confirmada correctamente. ¡Tu cuenta es más segura!
    </p>
  </UiAlert>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/composables/useToast'
import { resendVerificationEmail } from '@/services/authService'
import UiAlert from '@/components/ui/UiAlert.vue'
import UiButton from '@/components/ui/UiButton.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

library.add(faSpinner)

const authStore = useAuthStore()
const toast = useToast()
const isResending = ref(false)

const userVerified = computed(() => {
  return !!authStore.user?.email_confirmed_at
})

const handleResendVerification = async () => {
  isResending.value = true
  try {
    await resendVerificationEmail()
    toast.success('¡Correo de verificación enviado! Por favor, revisa tu bandeja de entrada.')
  } catch (error) {
    toast.error('Ocurrió un error al intentar reenviar el correo. Por favor, inténtalo de nuevo.')
  } finally {
    isResending.value = false
  }
}
</script>

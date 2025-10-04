<template>
  <div class="flex items-center justify-center p-6 min-h-screen">
    <div
      class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl dark:bg-gray-800 transition-all duration-300 transform scale-95 md:scale-100"
    >
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Recuperar Contraseña</h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para
          restablecer tu contraseña.
        </p>
      </div>

      <form @submit.prevent="handleRecovery" class="space-y-4">
        <UiAlert
          v-if="formError"
          intent="danger"
          title="Error"
          :description="formError"
          dismissible
        />
        <UiAlert
          v-if="successMessage"
          intent="success"
          title="Correo Enviado"
          :description="successMessage"
          dismissible
        />

        <UiFormField
          id="email"
          label="Email"
          type="email"
          v-model="email"
          :errorMessage="errors.email"
        >
          <template #icon>
            <font-awesome-icon :icon="['fas', 'envelope']" class="h-4 w-4 text-gray-400" />
          </template>
        </UiFormField>

        <div class="pt-4">
          <UiButton type="submit" class="w-full" :disabled="isDisabled">
            <span v-if="loading" class="flex items-center gap-2 justify-center">
              <font-awesome-icon :icon="['fas', 'spinner']" spin />
              Enviando...
            </span>
            <span v-else-if="countdown > 0" class="flex items-center gap-2 justify-center">
              <font-awesome-icon :icon="['fas', 'hourglass-half']" pulse />
              Intentar de nuevo en ({{ countdown }}s)
            </span>
            <span v-else>Enviar Enlace de Recuperación</span>
          </UiButton>
        </div>
      </form>

      <div class="text-sm text-center">
        <RouterLink
          :to="{ name: 'login' }"
          class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          Volver al inicio de sesión
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { resetPasswordForEmail } from '@/services/authService' // Reutilizaremos el servicio de auth
import UiButton from '@/components/ui/UiButton.vue'
import UiFormField from '@/components/ui/UiFormField.vue'
import UiAlert from '@/components/ui/UiAlert.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEnvelope, faHourglassHalf, faSpinner } from '@fortawesome/free-solid-svg-icons'

library.add(faEnvelope, faSpinner, faHourglassHalf) // Añade faHourglassHalf

const router = useRouter()
const toast = useToast()
const loading = ref(false)
const email = ref('')
const formError = ref('')
const successMessage = ref('')
const errors = ref({
  email: '',
})

// Estado para el temporizador
const countdown = ref(0) // Segundos restantes
let timer: ReturnType<typeof setInterval> | null = null

// La nueva variable 'isDisabled' manejará el estado del botón
const isDisabled = computed(() => loading.value || countdown.value > 0)

const validate = () => {
  errors.value.email = ''
  if (!email.value) {
    errors.value.email = 'El email es requerido.'
    return false
  }
  return true
}

// Función para iniciar la cuenta regresiva
const startCountdown = (seconds: number) => {
  countdown.value = seconds

  if (timer) clearInterval(timer) // Limpia el temporizador anterior por si acaso

  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      if (timer) clearInterval(timer)
      timer = null
    }
  }, 1000)
}

// Función que parsea el mensaje de error de Supabase
const parseRateLimitTime = (message: string): number => {
  // Ejemplo: "For security purposes, you can only request this after 57 seconds."
  const match = message.match(/after (\d+) seconds/)
  return match ? parseInt(match[1], 10) : 0
}

const handleRecovery = async () => {
  if (!validate()) {
    return
  }

  loading.value = true
  formError.value = ''
  successMessage.value = ''

  try {
    // Aquí es donde se llama a la API de Supabase para enviar el correo de recuperación
    // ANTES: const { error } = await resetPasswordForEmail(email.value)
    // ✅ CORRECCIÓN: Llamamos a la función sin esperar ninguna propiedad 'error'
    await resetPasswordForEmail(email.value) // La ejecución solo llega aquí si NO hubo error en el servicio.

    successMessage.value = 'Se ha enviado un enlace de recuperación a tu correo electrónico.'
    toast.success('Correo de recuperación enviado.')
  } catch (error: any) {
    console.error('Error al enviar correo de recuperación:', error)
    // Obtener el mensaje de error y el tiempo de espera
    const errorMessage =
      error && typeof error === 'object' && 'message' in error
        ? error.message
        : 'No se pudo enviar el correo de recuperación. Inténtalo de nuevo.'

    formError.value = errorMessage
    toast.error(formError.value)

    // **✅ Lógica de UX: Si es un error de Rate Limit, inicia el temporizador**
    if (errorMessage.includes('seconds')) {
      const waitTime = parseRateLimitTime(errorMessage)
      if (waitTime > 0) {
        startCountdown(waitTime)
      }
    }
  } finally {
    loading.value = false
  }
}
</script>

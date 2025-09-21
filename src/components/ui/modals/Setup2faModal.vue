<template>
  <div class="p-6">
    <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
      {{ modalTitle }}
    </h3>
    <p class="text-sm text-gray-600 dark:text-gray-300 mb-6">
      {{ modalDescription }}
    </p>

    <div class="space-y-4">
      <div v-if="progress === 'initial'" class="flex flex-col items-center text-center">
        <font-awesome-icon :icon="['fas', 'qrcode']" class="text-indigo-500 text-5xl mb-4" />
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Este proceso te guiará para configurar la autenticación de dos factores con una aplicación
          de autenticación.
        </p>
      </div>

      <div v-if="isLoading" class="flex flex-col items-center justify-center p-8 space-y-4">
        <font-awesome-icon :icon="['fas', 'spinner']" spin class="text-4xl text-indigo-500" />
        <p class="text-gray-600 dark:text-gray-400">Generando código QR...</p>
      </div>

      <div v-if="progress === 'qr'">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Escanea el siguiente código QR o usa el código de texto.
        </p>
        <div class="flex justify-center my-6">
          <div class="border p-1 rounded">
            <canvas ref="qrCodeCanvas" width="200" height="200"></canvas>
          </div>
        </div>
        <p
          class="text-center font-mono text-sm text-blue-500 break-all bg-gray-100 dark:bg-gray-700 p-2 rounded"
        >
          {{ secret }}
        </p>
        <p class="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
          Guarda este código de forma segura si no puedes escanear el QR.
        </p>
        <UiButton intent="primary" @click="progress = 'verify'" class="mt-4 mx-auto block">
          Ya lo escaneé
        </UiButton>
      </div>

      <div v-if="progress === 'verify'">
        <UiFormField
          id="2fa-code"
          label="Código de Verificación (6 dígitos)"
          placeholder="Ej: 123456"
          v-model="verificationCode"
          :error-message="errors.verificationCode"
          :disabled="isVerifying"
          @keyup.enter="handleVerify"
        />
      </div>

      <div v-if="progress === 'success'" class="flex flex-col items-center text-center">
        <font-awesome-icon :icon="['fas', 'check-circle']" class="text-green-500 text-4xl mb-4" />
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">¡2FA Habilitado!</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
          La Autenticación de Dos Factores ha sido activada en tu cuenta exitosamente.
        </p>
      </div>
    </div>

    <div class="pt-4 flex justify-end space-x-3">
      <UiButton
        v-if="progress !== 'success' && !isLoading"
        type="button"
        intent="secondary"
        @click="handleCancel"
        :disabled="isVerifying"
      >
        Cancelar
      </UiButton>
      <UiButton v-if="progress === 'initial'" type="button" intent="primary" @click="startSetup">
        Comenzar
      </UiButton>
      <UiButton
        v-if="progress === 'verify'"
        type="button"
        intent="primary"
        @click="handleVerify"
        :disabled="isVerifying || verificationCode.length !== 6"
      >
        <span v-if="isVerifying" class="flex items-center gap-2">
          <font-awesome-icon :icon="['fas', 'spinner']" spin />
          Verificando...
        </span>
        <span v-else>Confirmar y Habilitar</span>
      </UiButton>
      <UiButton v-if="progress === 'success'" type="button" intent="primary" @click="handleConfirm">
        Cerrar
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts" name="Setup2faModal">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiFormField from '@/components/ui/UiFormField.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSpinner, faCheckCircle, faQrcode } from '@fortawesome/free-solid-svg-icons'
import QRCode from 'qrcode'
import { start2faSetup, verify2fa } from '@/services/authService'
import { useToast } from '@/composables/useToast'
import type { ModalResult } from '@/types/modal'
import { useAuthStore } from '@/stores/authStore'

library.add(faSpinner, faCheckCircle, faQrcode)

const props = defineProps<{
  modalId: number
  __onConfirm: (result: ModalResult) => void
  __onCancel: (result: ModalResult) => void
  __onClose: (result: ModalResult) => void
}>()

const progress = ref('initial')
const secret = ref('')
const factorId = ref('')
const uri = ref('')
const verificationCode = ref('')
const isVerifying = ref(false)
const isLoading = ref(false)
const errors = ref({
  verificationCode: '',
})

const qrCodeCanvas = ref<HTMLCanvasElement | null>(null)
const authStore = useAuthStore()
const toast = useToast()

const modalTitle = computed(() => {
  // ... (tu lógica de título) ...
  switch (progress.value) {
    case 'initial':
      return 'Configurar 2FA'
    case 'qr':
      return 'Paso 1: Escanear Código QR'
    case 'verify':
      return 'Paso 2: Verificar'
    case 'success':
      return '¡2FA Habilitado!'
    default:
      return 'Configurar 2FA'
  }
})

const modalDescription = computed(() => {
  // ... (tu lógica de descripción) ...
  switch (progress.value) {
    case 'initial':
      return 'Sigue los pasos para proteger tu cuenta.'
    case 'qr':
      return 'Escanea el código QR con tu aplicación de autenticación para vincular tu cuenta.'
    case 'verify':
      return 'Ingresa el código de 6 dígitos generado por tu aplicación.'
    case 'success':
      return 'La autenticación de dos factores ha sido activada en tu cuenta exitosamente.'
    default:
      return 'Sigue los pasos para proteger tu cuenta.'
  }
})

async function startSetup() {
  isLoading.value = true
  try {
    const { id, totp } = await start2faSetup()

    secret.value = totp.secret
    factorId.value = id // ✅ es el factor_id necesario para verificar luego
    uri.value = totp.uri // ✅ ¡Aquí ya tienes el URI directo de Supabase!

    console.log('TOTP URI:', uri.value)
    console.log('Factor ID:', factorId.value) // Debe ser un UUID válido

    progress.value = 'qr'
  } catch (error) {
    console.error('Error al iniciar la configuración de 2FA:', error)
    toast.error('Ocurrió un error al generar la configuración 2FA.')
    handleCancel()
  } finally {
    isLoading.value = false
  }
}

async function generateQrCode() {
  await nextTick() // 👈 asegura que el canvas ya está montado en el DOM
  const canvas = qrCodeCanvas.value

  if (canvas && uri.value) {
    try {
      //await QRCode.toCanvas(canvas, uri.value)
      QRCode.toCanvas(canvas, uri.value, function (error) {
        if (error) console.error('QR error:', error)
      })

      //progress.value = 'verify' //provoca que el bloque del <canvas> (que depende de progress === 'qr') desaparezca antes de que el QR se pinte en pantalla.
    } catch (qrError) {
      console.error('Error al generar el código QR:', qrError)
      toast.error('Error al mostrar el código QR. Inténtalo de nuevo.')
      handleCancel()
    }
  } else {
    console.error('Elemento canvas no encontrado o URI inválido para generar el QR.')
    toast.error('Error interno al mostrar el código QR. Por favor, reinicia el proceso.')
    handleCancel()
  }
}

async function handleVerify() {
  if (verificationCode.value.length !== 6) {
    errors.value.verificationCode = 'El código debe tener 6 dígitos.'
    return
  }
  errors.value.verificationCode = ''
  isVerifying.value = true
  try {
    await verify2fa(factorId.value, verificationCode.value)
    progress.value = 'success'
    toast.success('¡2FA ha sido habilitado con éxito!')
  } catch (error) {
    console.error('Error al verificar 2FA:', error)
    errors.value.verificationCode = 'Código de verificación incorrecto. Inténtalo de nuevo.'
    toast.error('Código de verificación incorrecto.')
  } finally {
    isVerifying.value = false
  }
}

function handleConfirm() {
  props.__onConfirm({ action: 'confirm', payload: null } as ModalResult)
}

function handleCancel() {
  props.__onCancel({ action: 'cancel', payload: null } as ModalResult)
}

onMounted(() => {
  if (authStore.user?.factors?.length > 0) {
    toast.info('La autenticación de dos factores ya está habilitada para tu cuenta.')
    handleCancel()
  } else {
    progress.value = 'initial'
  }
})

// ✅ NUEVO WATCHER para manejar la generación del QR
watch(
  () => progress.value,
  (newValue) => {
    if (newValue === 'qr' && uri.value) {
      generateQrCode()
    }
  },
)
</script>

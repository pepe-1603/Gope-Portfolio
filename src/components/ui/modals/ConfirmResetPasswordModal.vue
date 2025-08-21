<template>
  <div class="p-4 text-center">
    <div class="flex justify-center items-center mb-4">
      <font-awesome-icon :icon="faEnvelopeOpen" class="w-12 h-12 text-blue-500" />
    </div>

    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Restablecer Contraseña</h2>
    <p class="text-gray-600 dark:text-gray-400 mb-6">
      Se enviará un enlace de restablecimiento a la dirección de correo
      <span class="font-bold">{{ email }}</span
      >. <br />
      ¿Desea continuar con el proceso?
    </p>

    <div class="flex justify-center gap-x-4">
      <button
        type="button"
        @click="cancel"
        class="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      >
        <font-awesome-icon :icon="faXmark" class="mr-2" />
        Cancelar
      </button>
      <button
        type="button"
        @click="confirm"
        class="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
      >
        <font-awesome-icon :icon="faPaperPlane" class="mr-2" />
        Continuar
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useModal } from '@/composables/useModal'
import { useToastStore } from '@/stores/toast'
import { faEnvelopeOpen, faPaperPlane, faXmark } from '@fortawesome/free-solid-svg-icons'

export default defineComponent({
  name: 'ConfirmResetPasswordModal',
  props: {
    email: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { close } = useModal()
    const toastStore = useToastStore()

    const confirm = async () => {
      // **Lógica para enviar el email de restablecimiento**
      // Aquí iría tu llamada a la API
      try {
        // await authService.sendPasswordResetEmail(props.email);
        toastStore.addToast({
          message: `Se ha enviado el enlace de recuperación a ${props.email}.`,
          type: 'success',
        })
      } catch (error) {
        toastStore.addToast({
          message: 'Error al enviar el email de recuperación.',
          type: 'error',
        })
      }
      close()
    }

    const cancel = () => {
      // Muestra un toast de cancelación
      toastStore.addToast({
        message: 'El proceso de restablecimiento de contraseña ha sido cancelado.',
        type: 'info',
      })
      close()
    }

    return {
      email: props.email,
      confirm,
      cancel,
      faEnvelopeOpen,
      faPaperPlane,
      faXmark,
    }
  },
})
</script>

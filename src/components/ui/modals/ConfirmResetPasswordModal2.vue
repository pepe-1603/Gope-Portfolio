<template>
  <div class="p-4 text-center">
    <h3>Accion Requerida PAra contrinuar</h3>
    <p>se conciente de esto.</p>
    <br />
    <div class="flex justify-center gap-x-4">
      <button
        type="button"
        @click="cancel"
        class="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
      >
        <font-awesome-icon :icon="faXmark" class="mr-2" />
        Cancelar
      </button>

      <button
        type="button"
        @click="openSecondaryModal"
        class="px-4 py-2 rounded-md bg-blue-500 text-white"
      >
        <font-awesome-icon :icon="faPaperPlane" class="mr-2" />
        Continuar
      </button>
    </div>
  </div>
</template>

<script lang="ts">
// ... (imports existentes)
import { useModal } from '@/composables/useModal'
import { useToastStore } from '@/stores/toast'
import { faEnvelopeOpen, faPaperPlane, faXmark } from '@fortawesome/free-solid-svg-icons'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ConfirmResetPasswordModal2',
  props: {
    email: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { close, open } = useModal() // Importamos también 'open'
    const toastStore = useToastStore()

    const openSecondaryModal = () => {
      // Abrimos el modal secundario sin cerrar el actual.
      open('ConfirmModal')
    }

    const cancel = () => {
      close()
      toastStore.addToast({
        message: 'El proceso de restablecimiento de contraseña ha sido cancelado.',
        type: 'info',
      })
    }

    return {
      email: props.email,
      openSecondaryModal,
      cancel,
      faEnvelopeOpen,
      faPaperPlane,
      faXmark,
    }
  },
})
</script>

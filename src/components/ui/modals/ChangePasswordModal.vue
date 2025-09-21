<template>
  <div class="p-6">
    <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Cambiar Contraseña</h3>
    <p class="text-sm text-gray-600 dark:text-gray-300 mb-6">
      Ingresa tu contraseña actual y la nueva contraseña para actualizar tu cuenta.
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
        id="current-password"
        label="Contraseña actual"
        type="password"
        v-model="formData.currentPassword"
        :error-message="errors.currentPassword"
      >
        <template #icon>
          <font-awesome-icon :icon="['fas', 'lock']" class="h-4 w-4 text-gray-400" />
        </template>
      </UiFormField>

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
        label="Confirmar Nueva Contraseña"
        type="password"
        v-model="formData.confirmPassword"
        :error-message="errors.confirmPassword"
      >
        <template #icon>
          <font-awesome-icon :icon="['fas', 'key']" class="h-4 w-4 text-gray-400" />
        </template>
      </UiFormField>

      <div class="pt-4 flex justify-end space-x-3">
        <UiButton type="button" intent="secondary" @click="handleCancel" :disabled="isLoading">
          Cancelar
        </UiButton>
        <UiButton type="submit" intent="primary" :disabled="isLoading">
          <span v-if="isLoading" class="flex items-center gap-2">
            <font-awesome-icon :icon="['fas', 'spinner']" spin />
            Guardando...
          </span>
          <span v-else>Guardar Cambios</span>
        </UiButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, type PropType } from 'vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiFormField from '@/components/ui/UiFormField.vue'
import UiAlert from '@/components/ui/UiAlert.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faLock, faKey, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useToast } from '@/composables/useToast'
import type { ModalResult } from '@/types/modal'

library.add(faLock, faKey, faSpinner)

const props = defineProps({
  modalId: { type: Number, required: true },
  __onConfirm: { type: Function as PropType<(result: ModalResult) => void>, required: true },
  __onCancel: { type: Function as PropType<(result: ModalResult) => void>, required: true },
  __onClose: { type: Function as PropType<(result: ModalResult) => void>, required: true },
})

const toast = useToast()
const formData = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const errors = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const formError = ref('')
const isLoading = ref(false)

const validateForm = () => {
  formError.value = ''
  Object.keys(errors).forEach((key) => (errors[key] = ''))
  let isValid = true

  if (!formData.currentPassword) {
    errors.currentPassword = 'La contraseña actual es requerida.'
    isValid = false
  }
  if (!formData.newPassword) {
    errors.newPassword = 'La nueva contraseña es requerida.'
    isValid = false
  } else if (formData.newPassword.length < 8) {
    errors.newPassword = 'La contraseña debe tener al menos 8 caracteres.'
    isValid = false
  }
  if (formData.newPassword !== formData.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden.'
    isValid = false
  }
  if (formData.newPassword === formData.currentPassword && formData.newPassword) {
    errors.newPassword = 'La nueva contraseña no puede ser igual a la actual.'
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
    // Simulación de la lógica del backend
    console.log('Simulando cambio de contraseña...')
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulación de un error de backend
    if (formData.currentPassword !== 'correcta') {
      throw new Error('La contraseña actual es incorrecta.')
    }

    // Si la llamada es exitosa
    toast.success('Contraseña actualizada con éxito.')
    props.__onConfirm({ action: 'confirm', payload: null } as ModalResult)
  } catch (err: any) {
    const message = err.message || 'Ocurrió un error inesperado al cambiar la contraseña.'
    toast.error(message)
    formError.value = message
    props.__onClose({ action: 'error', payload: null } as ModalResult)
  } finally {
    isLoading.value = false
  }
}

const handleCancel = () => {
  props.__onCancel({ action: 'cancel', payload: null } as ModalResult)
}
</script>

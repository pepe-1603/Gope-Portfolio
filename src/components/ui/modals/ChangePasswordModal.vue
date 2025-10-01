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
        dismissible
      />
      <UiAlert
        intent="warning"
        title="ATENCIÓN:"
        description="La implementacion de la interfaz para cambiar contraseña NO requiere la contraseña actual.
                    Solo necesitamos el valor de la nueva contraseña."
      />

      <UiFormField
        id="current-password"
        label="Contraseña actual"
        type="password"
        v-model="formData.currentPassword"
        :error-message="errors.currentPassword"
        disabled
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

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiFormField from '@/components/ui/UiFormField.vue'
import UiAlert from '@/components/ui/UiAlert.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faLock, faKey, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useToast } from '@/composables/useToast'
import type { ModalResult } from '@/types/modal'
import { userService } from '@/services/userService' // Importación correcta
import { logout } from '@/services/authService' // Importamos el logout para usarlo después de cambiar la contraseña

library.add(faLock, faKey, faSpinner)

export default defineComponent({
  name: 'UpdatePasswordModal',
  components: {
    UiButton,
    UiFormField,
    UiAlert,
    FontAwesomeIcon,
  },
  props: {
    modalId: { type: Number, required: true },
    __onConfirm: { type: Function as PropType<(result: ModalResult) => void>, required: true },
    __onCancel: { type: Function as PropType<(result: ModalResult) => void>, required: true },
    __onClose: { type: Function as PropType<(result: ModalResult) => void>, required: true },
  },
  data() {
    return {
      formData: {
        currentPassword: 'current_password',
        newPassword: '',
        confirmPassword: '',
      },
      errors: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      formError: '',
      isLoading: false,
    }
  },
  methods: {
    validateForm() {
      // Misma lógica de validación
      this.formError = ''
      Object.keys(this.errors).forEach((key) => (this.errors[key as keyof typeof this.errors] = ''))
      let isValid = true

      if (!this.formData.currentPassword) {
        this.errors.currentPassword = 'La contraseña actual es requerida.'
        isValid = false
      }
      if (!this.formData.newPassword) {
        this.errors.newPassword = 'La nueva contraseña es requerida.'
        isValid = false
      } else if (this.formData.newPassword.length < 8) {
        this.errors.newPassword = 'La contraseña debe tener al menos 8 caracteres.'
        isValid = false
      }
      if (this.formData.newPassword !== this.formData.confirmPassword) {
        this.errors.confirmPassword = 'Las contraseñas no coinciden.'
        isValid = false
      }
      if (
        this.formData.newPassword === this.formData.currentPassword &&
        this.formData.newPassword
      ) {
        this.errors.newPassword = 'La nueva contraseña no puede ser igual a la actual.'
        isValid = false
      }

      return isValid
    },
    async handleSubmit() {
      if (!this.validateForm()) {
        this.formError = 'Por favor, corrige los errores del formulario.'
        return
      }

      this.isLoading = true
      this.formError = ''
      const toast = useToast()

      try {
        // Llama al método del nuevo servicio para cambiar la contraseña
        await userService.changePassword(this.formData.newPassword)

        // Si la llamada es exitosa, muestra un mensaje y cierra sesión por seguridad
        toast.success('Contraseña actualizada con éxito.')
        await logout() // Cierra la sesión
        this.__onConfirm({ action: 'confirm', payload: null } as ModalResult)
      } catch (err: any) {
        const message = err.message || 'Ocurrió un error inesperado al cambiar la contraseña.'
        toast.error(message)
        this.formError = message
        this.__onClose({ action: 'close', payload: null } as ModalResult)
      } finally {
        this.isLoading = false
      }
    },
    handleCancel() {
      this.__onCancel({ action: 'cancel', payload: null } as ModalResult)
    },
  },
})
</script>

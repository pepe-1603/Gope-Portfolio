<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
    <div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-6">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Acceso de Administrador</h2>
      </div>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <UiFormField
          id="email"
          label="Email"
          type="email"
          v-model="email"
          placeholder="email@ejemplo.com"
          :errorMessage="errors.email"
        />
        <UiFormField
          id="password"
          label="Contraseña"
          type="password"
          v-model="password"
          placeholder="••••••••"
          :errorMessage="errors.password"
        />
        <UiButton
          type="submit"
          :disabled="loading"
          class="w-full"
          :variant="loading ? 'disabled' : 'default'"
        >
          <UiSpinner v-if="loading" />
          <span v-else>Iniciar Sesión</span>
        </UiButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore' // Importa el store

import UiButton from '@/components/ui/UiButton.vue'
import UiFormField from '@/components/ui/UiFormField.vue'
import UiSpinner from '@/components/ui/UiSpinner.vue'

const router = useRouter()
const authStore = useAuthStore() // Obtén la instancia del store

const email = ref('')
const password = ref('')
const loading = ref(false)
const errors = ref({
  email: '',
  password: '',
})

const validate = () => {
  errors.value.email = email.value ? '' : 'El email es requerido.'
  errors.value.password = password.value ? '' : 'La contraseña es requerida.'
  return !errors.value.email && !errors.value.password
}

const handleLogin = async () => {
  if (!validate()) {
    return
  }

  loading.value = true
  try {
    await authStore.login({ email: email.value, password: password.value })
  } catch (error) {
    // El store ya maneja el toast, no necesitas nada aquí a menos que quieras otra cosa
  } finally {
    loading.value = false
  }
}
</script>

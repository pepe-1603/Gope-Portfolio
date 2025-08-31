<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
    <div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-6">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Acceso de Administrador</h2>
      </div>
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div >
          <UiFormField
            id="email"
            label="Email"
            type="email"
            v-model="email"
            placeholder="mi-correo@example.com"
            :errorMessage="errors.email"
          />
          <UiFormField
            id="password"
            label="Contraseña"
            type="password"
            v-model="password"
            placeholder="•••••••••••"
            :errorMessage="errors.password"
          />
        </div>
        <div class="w-full flex items-center justify-evenly">
          <UiButton
            type="submit"
            class="w-1/2"
            :disabled="loading"
            :variant="loading ? 'disabled' : 'default'"
          >
            <UiSpinner v-if="loading" message="loading"/>
            <span v-else>Iniciar Sesión</span>
          </UiButton>
          <UiButton
            @click="handleCancel"
            type="button"
            intent="secondary"
          >
            Cancelar
          </UiButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts" name="AdminLoginView">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

import UiButton from '@/components/ui/UiButton.vue';
import UiFormField from '@/components/ui/UiFormField.vue';
import UiSpinner from '@/components/ui/UiSpinner.vue';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const loading = ref(false);
const errors = ref({
  email: '',
  password: '',
});

const validate = () => {
  errors.value.email = email.value ? '' : 'El email es requerido.';
  errors.value.password = password.value ? '' : 'La contraseña es requerida.';
  return !errors.value.email && !errors.value.password;
};

const handleLogin = async () => {
  if (!validate()) {
    return;
  }

  loading.value = true;
  try {
    await authStore.login({ email: email.value, password: password.value });
    // Si el login es exitoso, redirige al usuario a la página de administración
    router.push({ name: 'admin-dashboard' });
  } catch (error) {
    // El store ya maneja el toast
  } finally {
    loading.value = false;
  }
};

// 🚀 Nueva función para manejar el botón de cancelar
const handleCancel = () => {
  router.back();
};
</script>

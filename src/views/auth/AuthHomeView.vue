<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faShieldHalved, faLock, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import UiButton from '@/components/ui/UiButton.vue';
import { useAuthStore } from '@/stores/authStore';

// Agrega los íconos a la librería
library.add(faShieldHalved, faLock, faUserCheck);

const authStore = useAuthStore();
</script>

<template>
  <div class="flex flex-col items-center justify-center p-8 rounded-xl shadow-2xl max-w-md mx-auto mt-12 text-center border
              bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">

    <div v-if="!authStore.isAuthenticated">
      <div class="flex items-center justify-center w-20 h-20 rounded-full mb-6 shadow-inner
                  bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
        <FontAwesomeIcon icon="fas fa-shield-halved" class="text-4xl" />
      </div>
      <h1 class="text-3xl font-extrabold mb-2
                 text-gray-900 dark:text-white">
        Acceso Restringido
      </h1>
      <p class="text-lg mb-6 px-4
                 text-gray-600 dark:text-gray-400">
        Esta sección es exclusiva para el personal autorizado. Por favor, inicia sesión para continuar.
      </p>
      <UiButton
        :to="{ name: 'login' }"
        class="w-full sm:w-auto mt-4"
        intent="primary"
      >
        <FontAwesomeIcon icon="fas fa-lock" class="mr-2" />
        Iniciar Sesión
      </UiButton>
    </div>

    <div v-else>
      <div class="flex items-center justify-center w-20 h-20 rounded-full mb-6 shadow-inner
                  bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
        <FontAwesomeIcon icon="fas fa-user-check" class="text-4xl" />
      </div>
      <h1 class="text-3xl font-extrabold mb-2
                 text-gray-900 dark:text-white">
        Bienvenido de nuevo
      </h1>
      <p class="text-lg mb-6 px-4
                 text-gray-600 dark:text-gray-400">
        Ya tienes una sesión activa. Puedes ir al panel de administración para gestionar el contenido.
      </p>
      <RouterLink :to="{ name: 'admin-dashboard' }">
        <UiButton
          class="w-full sm:w-auto mt-4"
          intent="primary"
        >
          <FontAwesomeIcon icon="fas fa-shield-halved" class="mr-2" />
          Ir al Panel
        </UiButton>
      </RouterLink>

    </div>
  </div>
</template>

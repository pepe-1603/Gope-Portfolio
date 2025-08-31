<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faExclamationTriangle, faHome } from '@fortawesome/free-solid-svg-icons';
import UiButton from '@/components/ui/UiButton.vue';

// Agrega los íconos a la librería para que estén disponibles
library.add(faExclamationTriangle, faHome);
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen text-center p-4
              bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

    <div class="flex items-center justify-center w-24 h-24 rounded-full mb-6
                bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400">
      <FontAwesomeIcon icon="fas fa-exclamation-triangle" class="text-5xl" />
    </div>

    <h1 class="text-6xl md:text-7xl font-extrabold mb-4
               text-gray-900 dark:text-gray-100">
      404
    </h1>

    <h2 class="text-2xl md:text-3xl font-semibold mb-3
               text-gray-800 dark:text-gray-200">
      Página No Encontrada
    </h2>

    <p class="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg">
      Lo sentimos, la página que estás buscando no existe. Es posible que la URL esté incorrecta o que la página haya sido eliminada.
    </p>

    <RouterLink
    :to="{ name: 'home' }" >

      <UiButton
        class="w-full sm:w-auto mt-4 px-8 py-3"
        intent="primary"
      >
        <FontAwesomeIcon icon="fas fa-home" class="mr-2" />
        Volver al inicio
      </UiButton>
    </RouterLink>


  </div>
</template>

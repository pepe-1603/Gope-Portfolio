<script setup lang="ts">
import { useGlobalModal } from '@/composables/useGlobalModal';

import { ref } from 'vue';
import LoginModal from './ui/modals/LoginModal.vue';

const $modal = useGlobalModal();
const loginResult = ref<any>(null);

const showLoginModal = async () => {
  try {
    // 🚀 Llamamos al servicio para mostrar el modal y esperamos la respuesta.
    // Pasamos el componente LoginModal directamente, sin necesidad de registro global.
    const result = await $modal.showModal(
      LoginModal,
      {},
      {
        title: 'Inicio de Sesión',
        closeOnClickOutside: false, // El usuario debe interactuar con el modal.
      }
    );

    // 🚀 La promesa se resuelve aquí una vez que el modal se cierra.
    // 'result' contendrá el objeto que le pasamos a la función de cierre (__onConfirm, __onCancel).
    loginResult.value = result;
    console.log('Resultado del modal:', result);

    if (result.action === 'confirm' && result.payload?.success) {
      alert('¡Login exitoso!');
    } else {
      alert('Login fallido o cancelado.');
    }

  } catch (error) {
    console.error('Error al mostrar el modal:', error);
  }
};
</script>

<template>
  <div class="p-8 text-center bg-gray-100 rounded-lg shadow-md ">
    <h2 class="text-xl font-bold mb-4">Muestra el Modal de Login</h2>
    <p class="mb-4 text-gray-700">Haz clic en el botón para abrir el modal de inicio de sesión.</p>

    <button
      @click="showLoginModal"
      class="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-200"
    >
      Abrir Modal de Login
    </button>

    <div v-if="loginResult" class="mt-4 p-4 border border-gray-300 rounded-md bg-gray-50 text-left ease-in-out ">
      <h3 class="font-semibold text-lg">Último Resultado del Modal:</h3>
      <pre class="whitespace-pre-wrap text-sm text-gray-800">{{ JSON.stringify(loginResult, null, 2) }}</pre>
    </div>
  </div>
</template>

<template>
  <div class="p-4">
    <div class="flex items-center space-x-4 mb-4">
      <font-awesome-icon
        :icon="['fas', 'right-from-bracket']"
        class="text-red-500 text-3xl"
      />
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
        Confirmar Cierre de Sesión
      </h2>
    </div>

    <p class="text-gray-600 dark:text-gray-400 mb-6">
      ¿Estás seguro de que deseas cerrar tu sesión actual? Deberás volver a iniciar
      sesión para acceder a las funcionalidades de administrador.
    </p>

    <div class="flex justify-end gap-x-2">
      <button
        type="button"
        @click="handleCancel"
        class="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      >
        Cancelar
      </button>

      <button
        type="button"
        @click="handleConfirm"
        class="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
      >
        Cerrar Sesión
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { ModalResult } from '@/types/modal.d.ts'; // Asegúrate de que esta ruta sea correcta
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

// Añadir el icono a la librería de Font Awesome
library.add(faRightFromBracket);

export default defineComponent({
  name: 'ConfirmLogoutModal',
  // Props inyectadas por useGlobalModal
  props: {
    modalId: { type: Number, required: true },
    __onConfirm: { type: Function, required: true },
    __onCancel: { type: Function, required: true },
    __onClose: { type: Function, required: true },
  },
  setup(props) {
    /**
     * Confirma la acción de cerrar sesión.
     * @returns {void}
     */
    const handleConfirm = () => {
      // Pasamos un resultado con la acción 'confirm'
      props.__onConfirm({ action: 'confirm', payload: null } as ModalResult);
    };

    /**
     * Cancela la acción de cerrar sesión.
     * @returns {void}
     */
    const handleCancel = () => {
      // Pasamos un resultado con la acción 'cancel'
      props.__onCancel({ action: 'cancel', payload: null } as ModalResult);
    };

    return {
      handleConfirm,
      handleCancel,
    };
  },
  components: { FontAwesomeIcon },
});
</script>

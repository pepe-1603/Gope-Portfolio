<script lang="ts">
import { defineComponent } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import UiButton from '../UiButton.vue';

// Agrega el ícono a la librería de Font Awesome
library.add(faCheckCircle);

export default defineComponent({
  name: 'NoAuthNeededModal',
  components: {
    FontAwesomeIcon,
    UiButton,
  },
  props: {
    // Definimos las props que el servicio de modales usará.
    // __onConfirm es la función que se llama al hacer clic en 'Aceptar'.
    __onConfirm: {
      type: Function,
      required: true,
    },
  },
  methods: {
    // Método que se ejecuta al hacer clic en el botón
    handleAccept() {
      // Cuando se hace clic en el botón, llamamos a la función
      // __onConfirm para cerrar el modal.
      this.__onConfirm({ accepted: true });
    },
  },
});
</script>

<template>
  <div class="p-4 text-center">
    <div class="mb-4">
      <h3 class="text-xl font-semibold mb-2">
        <FontAwesomeIcon icon="fas fa-check-circle" class="text-green-500" />
        Ya tienes una sesión activa
      </h3>
      <p class="text-gray-600">
        No es necesario que inicies sesión de nuevo. Ya estás autenticado y puedes acceder al contenido privado.
      </p>
    </div>
    <div class="flex justify-center">
      <UiButton
        @click="handleAccept"
        intent="link"
      >
        Aceptar
      </UiButton>
    </div>
  </div>
</template>

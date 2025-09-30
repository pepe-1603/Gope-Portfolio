<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import UiButton from '../UiButton.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faWarning } from '@fortawesome/free-solid-svg-icons';

library.add(faWarning, faUser)

const props = defineProps({
  __onConfirm: {
    type: Function,
    required: true
  },
});

const handleAccept = () => {
  props.__onConfirm({ accepted: true });
};
</script>

<template>
  <div class="p-4 text-center">
    <div class="mb-4">
      <h3 class="text-xl font-semibold mb-2"> <FontAwesomeIcon icon="fas fa-warning" /> Acceso Restringido</h3>
      <p class="text-gray-600">
        Para continuar, debes iniciar sesión. Este panel es exclusivo para el propietario <FontAwesomeIcon icon="fas fa-user" />.
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

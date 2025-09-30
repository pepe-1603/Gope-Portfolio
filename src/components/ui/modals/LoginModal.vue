<template>
  <div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-6">
    <div class="text-center">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Acceso de Administrador</h2>
    </div>
    <form @submit.prevent="handleLogin" class="space-y-4">
      <button type="submit">Iniciar Sesión</button>
    </form>
    <button @click="handleCancel">Cancelar</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import type { ModalResult } from '@/types/modal.d.ts';

export default defineComponent({
  name: 'LoginModal',
  // Props inyectadas por el ModalService
  props: {
    modalId: { type: Number, required: true },
    __onConfirm: { type: Function, required: true },
    __onCancel: { type: Function, required: true },
    __onClose: { type: Function, required: true },
  },
  setup(props) {
    const email = ref('');
    const password = ref('');
    const errors = ref({ email: '', password: '' });

    const handleLogin = async () => {
      // Lógica de autenticación
      // ...
      // Al finalizar, llama a la prop __onConfirm o __onCancel
      props.__onConfirm({ success: true } as ModalResult['payload']);
    };

    const handleCancel = () => {
      // Llama a la prop __onCancel al cancelar
      props.__onCancel({ canceled: true } as ModalResult['payload']);
    };

    return {
      email,
      password,
      errors,
      handleLogin,
      handleCancel,
    };
  },
});
</script>

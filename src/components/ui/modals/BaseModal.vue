<template>
  <Transition name="modal-fade">
    <div
      v-if="active"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      @click.self="closeModalOnOutsideClick"
    >
      <div
        class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-h-screen overflow-y-auto"
        :class="containerClass"
      >
        <slot></slot>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';

export default defineComponent({
  name: 'BaseModal',
  props: {
    active: {
      type: Boolean,
      required: true,
    },
    closeOnClickOutside: {
      type: Boolean,
      default: true,
    },
    containerClass: {
      type: [String, Object],
      default: '',
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const handleKeydown = (event: KeyboardEvent) => {
      if (props.active && event.key === 'Escape') {
        emit('close');
      }
    };

    const closeModalOnOutsideClick = () => {
      if (props.closeOnClickOutside) {
        emit('close');
      }
    };

    watch(
      () => props.active,
      (isActive, wasActive) => {
        if (isActive) {
          document.addEventListener('keydown', handleKeydown);
        } else if (wasActive) {
          document.removeEventListener('keydown', handleKeydown);
        }
      },
    );

    return {
      closeModalOnOutsideClick,
    };
  },
});
</script>

<style scoped>
/* Estilos para la transición de entrada y salida */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>

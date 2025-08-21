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
import { defineComponent, computed, watch } from 'vue'

export default defineComponent({
  name: 'BaseModal',
  props: {
    // La propiedad 'active' determina si el modal está visible o no
    active: {
      type: Boolean,
      required: true,
    },
    // Si el modal se puede cerrar al hacer clic fuera
    closeOnClickOutside: {
      type: Boolean,
      default: true,
    },
    // Clase adicional para el contenedor del modal, si se necesita
    containerClass: {
      type: [String, Object],
      default: '',
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const closeModal = () => {
      emit('close')
    }

    const closeModalOnOutsideClick = () => {
      if (props.closeOnClickOutside) {
        closeModal()
      }
    }

    // Cerrar con la tecla Escape
    const handleKeydown = (event: KeyboardEvent) => {
      if (props.active && event.key === 'Escape') {
        closeModal()
      }
    }

    // Añadir/quitar el listener del teclado
    watch(
      () => props.active,
      (isActive) => {
        if (isActive) {
          document.addEventListener('keydown', handleKeydown)
        } else {
          document.removeEventListener('keydown', handleKeydown)
        }
      },
    )

    return {
      closeModalOnOutsideClick,
    }
  },
})
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

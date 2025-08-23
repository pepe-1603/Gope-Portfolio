<template>
  <div ref="sentinel" class="h-1 text-center"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const sentinel = ref(null)
const observer = ref(null)

// Define los eventos que el componente padre puede escuchar
const emit = defineEmits(['intersect'])

onMounted(() => {
  // Opciones para el IntersectionObserver
  const options = {
    root: null, // El viewport es el área de detección
    rootMargin: '0px',
    threshold: 0.1, // Activar cuando el 10% del sentinela es visible
  }

  observer.value = new IntersectionObserver((entries) => {
    // Si la entrada intersecta (es visible), emitimos un evento
    if (entries[0].isIntersecting) {
      emit('intersect')
    }
  }, options)

  // Comienza a observar el elemento 'sentinel'
  if (sentinel.value) {
    observer.value.observe(sentinel.value)
  }
})

onUnmounted(() => {
  // Limpia el observador cuando el componente se desmonta
  if (observer.value) {
    observer.value.disconnect()
  }
})
</script>

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'

import ToastContainer from './components/ui/ToastContainer.vue'
import ModalContainer from './components/ui/modals/ModalContainer.vue'
import { watch } from 'vue'
import { useThemeStore } from './stores/theme'

const route = useRoute() // Importa useRoute para acceder a la ruta actual

const themeStore = useThemeStore()


// Modo oscuro reactivo
watch(
  () => themeStore.isDarkMode,
  (newVal) => {
    if (newVal) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  },
  { immediate: true },
)
</script>

<template>
    <ToastContainer />
    <ModalContainer />

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" :key="route.fullPath" />
      </transition>
    </router-view>

</template>

<style>
/* CSS para la transición 'fade' */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Recomendación para mejorar la experiencia:
  Si quieres evitar que los usuarios hagan clic mientras la transición está activa,
  puedes añadir una clase que deshabilite los eventos del puntero.
*/
.fade-enter-active,
.fade-leave-active {
  pointer-events: none;
}
</style>

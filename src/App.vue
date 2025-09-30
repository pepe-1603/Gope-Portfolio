<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'

import ToastContainer from './components/ui/ToastContainer.vue'
import ModalContainer from './components/ui/modals/ModalContainer.vue'
import { watch } from 'vue'
import { useThemeStore } from './stores/theme'

const route = useRoute()

const themeStore = useThemeStore()

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
  <div>
    <ToastContainer />
    <ModalContainer />

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" :key="route.fullPath" />
      </transition>
    </router-view>
  </div>
</template>

<style>
/* ... Tu CSS ... */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  pointer-events: none;
}
</style>

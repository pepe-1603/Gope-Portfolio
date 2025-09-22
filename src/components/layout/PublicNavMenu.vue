<template>
  <div class="flex items-center space-x-4">
    <router-link
      to="/proyectos"
      class="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
    >
      Proyectos
    </router-link>
    <router-link
      to="/about"
      class="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
    >
      Sobre Mí
    </router-link>
    <router-link
      to="/admin"
      class="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
    >
      Admin Panel
    </router-link>
    <router-link
      to="/test"
      class="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
    >
      Test Preview
    </router-link>
    <SettingsDropdown />
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import SettingsDropdown from '@/components/common/SettingsDropdown.vue'
</script>

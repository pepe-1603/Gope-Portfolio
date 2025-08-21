<template>
  <ul
    class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400"
  >
    <li v-for="(tab, index) in tabs" :key="index" class="me-2">
      <router-link :to="tab.path" custom v-slot="{ isActive, href, navigate }">
        <a
          :href="href"
          @click="!tab.disabled && navigate"
          :class="[
            'inline-block p-4 rounded-t-lg',
            isActive || currentRoute.path === tab.path
              ? 'text-indigo-600 bg-gray-100 dark:bg-gray-800 dark:text-indigo-500'
              : 'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300',
            tab.disabled ? 'text-gray-400 cursor-not-allowed dark:text-gray-500' : '',
          ]"
          :aria-current="isActive || currentRoute.path === tab.path ? 'page' : undefined"
          :aria-disabled="tab.disabled ? 'true' : undefined"
          tabindex="0"
        >
          {{ tab.label }}
        </a>
      </router-link>
    </li>
  </ul>
  <div class="mt-4">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { defineProps, withDefaults } from 'vue'
// If you are passing `currentRoute` as a prop from a parent,
// you don't need to import `useRoute` here.
// import { useRoute, type RouteLocationNormalizedLoaded } from 'vue-router';

// 1. Define the interface for a single tab object
interface TabItem {
  label: string
  path: string
  disabled?: boolean // Optional property for disabling tabs
}

// 2. Define the props interface for the UiTab component
interface UiTabProps {
  tabs: TabItem[]
  // Assuming currentRoute will be of type RouteLocationNormalizedLoaded from vue-router
  // You might need to import `RouteLocationNormalizedLoaded` if you're strict about its type.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentRoute: { path: string; [key: string]: any } // Simplified type for currentRoute, adjust if needed
}

// Use withDefaults for type inference and default values
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(defineProps<UiTabProps>(), {
  tabs: () => [], // Default empty array for tabs
  // currentRoute is required, so no default needed here unless you provide a fallback route object
})

// If you were using useRoute inside this component:
// const currentRoute = useRoute();
// But since you're passing it as a prop, the above is commented out.
</script>

<style scoped>
/* You can add additional styles here if desired */
</style>

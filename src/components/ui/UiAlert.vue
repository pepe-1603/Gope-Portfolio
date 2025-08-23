<template>
  <div v-if="isVisible" :class="styles">
    <div class="flex-shrink-0 self-start">
      <font-awesome-icon :icon="iconForIntent" class="w-5 h-5 opacity-70" />
    </div>

    <div class="flex-1 ml-3">
      <p v-if="title" class="font-bold leading-none">{{ title }}</p>
      <p v-if="description">{{ description }}</p>
      <slot />
    </div>

    <div v-if="dismissible" class="ml-auto pl-3 -my-1">
      <button
        @click="isVisible = false"
        class="rounded-md p-1.5 focus:outline-none focus:ring-2"
        :class="{
          'hover:bg-blue-200 dark:hover:bg-blue-800 focus:ring-blue-500': intent === 'info',
          'hover:bg-green-200 dark:hover:bg-green-800 focus:ring-green-500': intent === 'success',
          'hover:bg-yellow-200 dark:hover:bg-yellow-800 focus:ring-yellow-500':
            intent === 'warning',
          'hover:bg-red-200 dark:hover:bg-red-800 focus:ring-red-500': intent === 'danger',
        }"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { alertStyles, type AlertVariants } from '../../utils/alertStyles'

// Importamos solo los íconos que vamos a usar en este componente
import {
  faCircleInfo,
  faTriangleExclamation,
  faCircleCheck,
  faCircleExclamation,
  faCircleXmark,
} from '@fortawesome/free-solid-svg-icons'

const props = defineProps<{
  intent?: AlertVariants['intent']
  variant?: AlertVariants['variant']
  title?: string
  description?: string
  dismissible?: boolean
}>()

const isVisible = ref(true)

const iconForIntent = computed(() => {
  switch (props.intent) {
    case 'info':
      return faCircleInfo
    case 'success':
      return faCircleCheck
    case 'warning':
      return faTriangleExclamation
    case 'danger':
      return faCircleXmark
    default:
      return faCircleExclamation
  }
})

const styles = computed(() => {
  return alertStyles({
    intent: props.intent,
    variant: props.variant,
  })
})
</script>

<template>
  <div v-if="isVisible" class="p-2 border rounded-lg border-gray-300 dark:border-gray-600">
    <div class="relative w-full rounded p-2 transition-max-height duration-500 ease-in-out">
      <div :class="barClasses"></div>

      <div class="flex flex-col pl-4 pr-8 cursor-text" :class="textClasses">
        <div class="flex items-center gap-2">
          <font-awesome-icon v-if="title" :icon="iconForIntent" />
          <p class="font-semibold text-sm">{{ title }}</p>
        </div>

        <div class="mt-1">
          <div ref="contentWrapper" :class="contentWrapperClasses">
            <p v-if="description" class="mb-2">{{ description }}</p>
            <div v-if="$slots.default">
              <slot />
            </div>
          </div>

          <button
            v-if="needsExpand"
            @click="isExpanded = !isExpanded"
            class="text-xs font-semibold mt-1"
            :class="textClasses"
          >
            {{ isExpanded ? 'Mostrar menos' : 'Mostrar más...' }}
          </button>
        </div>
      </div>

      <div v-if="dismissible" class="absolute top-1 right-2">
        <button
          @click="isVisible = false"
          class="rounded-full p-1 transition-colors duration-200"
          :class="dismissButtonClasses"
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  faCircleInfo,
  faTriangleExclamation,
  faCircleCheck,
  faCircleXmark,
  faCircleExclamation,
  faStar,
  faBolt,
} from '@fortawesome/free-solid-svg-icons'
import {
  alertBarStyles,
  alertTextStyles,
  alertDismissButtonStyles,
  type AlertVariants,
} from '../../utils/alertStyles'

type AlertIntent = AlertVariants['intent'] | 'upcoming' | 'new-feature'

const props = defineProps<{
  intent?: AlertIntent
  title: string
  dismissible?: boolean
  description?: string
}>()

const isVisible = ref(true)
const isExpanded = ref(false)
const contentWrapper = ref<HTMLDivElement | null>(null)

const needsExpand = ref(false)

onMounted(() => {
  if (contentWrapper.value) {
    const contentHeight = contentWrapper.value.scrollHeight
    const visibleHeight = contentWrapper.value.clientHeight
    needsExpand.value = contentHeight > visibleHeight
  }
})

const contentWrapperClasses = computed(() => {
  return [
    'transition-max-height duration-300 ease-in-out',
    'max-h-24 overflow-y-hidden cursor-text',
    { '!max-h-full overflow-y-auto': isExpanded.value },
  ]
})

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
    case 'upcoming':
      return faBolt
    case 'new-feature':
      return faStar
    default:
      return faCircleExclamation
  }
})

const barClasses = computed(() => {
  return alertBarStyles({ intent: props.intent as AlertVariants['intent'] })
})
const textClasses = computed(() => {
  return alertTextStyles({ intent: props.intent as AlertVariants['intent'] })
})
const dismissButtonClasses = computed(() => {
  return alertDismissButtonStyles({ intent: props.intent as AlertVariants['intent'] })
})
</script>

<script setup lang="ts">
import { computed, withDefaults } from 'vue'
import { stepColors } from '@/utils/progressStepColors'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

interface Step {
  label: string
  icon?: string
}

interface Props {
  steps: Step[]
  currentStep: number
  color?: keyof typeof stepColors
  animated?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: 'indigo',
  animated: false,
})

const colorClasses = computed(() => {
  return stepColors[props.color] || stepColors.indigo
})
</script>

<template>
  <ol
    class="flex items-center justify-center gap-4 text-sm font-medium text-gray-500 dark:text-gray-400"
  >
    <li
      v-for="(step, index) in steps"
      :key="index"
      class="flex items-center space-x-2"
      :class="{ 'text-gray-900 dark:text-white': index === currentStep }"
    >
      <!-- Círculo -->
      <div
        class="w-3 h-3 rounded-full flex items-center justify-center"
        :class="[
          index <= currentStep ? colorClasses.bg : 'bg-gray-300',
          animated ? 'transition-all duration-300' : '',
        ]"
      >
        <template v-if="index === currentStep">
          <div class="w-2 h-2 rounded-full bg-white"></div>
        </template>
      </div>

      <!-- Texto o icono -->
      <span class="whitespace-nowrap flex items-center gap-1">
        <template v-if="step.icon">
          <FontAwesomeIcon :icon="['fas', step.icon]" :class="colorClasses.text" />
        </template>
        {{ step.label }}
      </span>
    </li>
  </ol>
</template>

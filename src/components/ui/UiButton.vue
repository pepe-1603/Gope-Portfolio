<template>
  <button :class="styles" :disabled="disabled">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { buttonStyles, type ButtonVariants } from '@/utils/buttonStyles'

const props = defineProps<{
  intent?: ButtonVariants['intent']
  size?: ButtonVariants['size']
  fullWidth?: boolean
  disabled?: boolean
}>()

const styles = computed(() => {
  return buttonStyles({
    intent: props.intent,
    size: props.size,
    fullWidth: props.fullWidth,
    disabled: props.disabled,
  })
})
</script>

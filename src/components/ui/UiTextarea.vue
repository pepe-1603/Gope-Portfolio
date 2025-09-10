<template>
  <div class="space-y-1">
    <label v-if="label" :for="id" class="text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label }}
    </label>
    <textarea
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="updateValue"
      :class="styles"
      :rows="computedRows"
    />
    <p v-if="errorMessage" class="text-xs text-red-500">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formFieldStyles, type FormFieldVariants } from '@/utils/formFieldStyles'

const props = withDefaults(
  defineProps<{
    label?: string
    id: string
    modelValue: string
    placeholder?: string
    disabled?: boolean
    errorMessage?: string
    intent?: FormFieldVariants['intent']
    minRows?: number
    maxRows?: number
  }>(),
  {
    disabled: false,
    intent: 'default',
    minRows: 4,
    maxRows: 12,
  },
)

const emit = defineEmits(['update:modelValue'])

const updateValue = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

const computedRows = computed(() => {
  const lineCount = props.modelValue.split('\n').length
  return Math.min(Math.max(lineCount, props.minRows), props.maxRows)
})

const styles = computed(() => {
  const baseStyles = formFieldStyles({
    intent: props.disabled ? 'disabled' : props.errorMessage ? 'error' : props.intent,
  })

  // Evita el cambio manual de tamaño por el usuario
  // Y si llega al máximo, habilita el scroll
  const dynamicStyles = [
    'resize-none',
    props.modelValue.split('\n').length > props.maxRows ? 'overflow-y-auto' : 'overflow-hidden',
  ]

  return [...baseStyles.split(' '), ...dynamicStyles].join(' ')
})
</script>

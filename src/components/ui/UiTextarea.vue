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
  }>(),
  {
    disabled: false,
    intent: 'default',
  },
)

const emit = defineEmits(['update:modelValue'])

const updateValue = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

const styles = computed(() => {
  return formFieldStyles({
    intent: props.disabled ? 'disabled' : props.errorMessage ? 'error' : props.intent,
  })
})
</script>

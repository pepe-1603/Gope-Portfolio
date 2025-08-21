<template>
  <div class="flex items-center">
    <input
      :id="id"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      @change="updateValue"
      :class="styles"
    />
    <label v-if="label" :for="id" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
      {{ label }}
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { checkboxStyles, type CheckboxVariants } from '../../utils/checkboxStyles'

const props = withDefaults(
  defineProps<{
    label?: string
    id: string
    modelValue: boolean
    disabled?: boolean
    intent?: CheckboxVariants['intent']
  }>(),
  {
    disabled: false,
    intent: 'default',
  },
)

const emit = defineEmits(['update:modelValue'])

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}

const styles = computed(() => {
  return checkboxStyles({
    intent: props.intent,
    disabled: props.disabled,
  })
})
</script>

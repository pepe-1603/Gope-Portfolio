<template>
  <div class="flex items-center">
    <input
      :id="id"
      type="radio"
      :name="name"
      :value="value"
      :checked="modelValue === value"
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
import { radioStyles, type RadioVariants } from '../../utils/radioStyles'

const props = withDefaults(
  defineProps<{
    label?: string
    id: string
    name: string
    value: string | number
    modelValue: string | number
    disabled?: boolean
    intent?: RadioVariants['intent']
  }>(),
  {
    disabled: false,
    intent: 'default',
  },
)

const emit = defineEmits(['update:modelValue'])

const updateValue = () => {
  emit('update:modelValue', props.value)
}

const styles = computed(() => {
  return radioStyles({
    intent: props.intent,
    disabled: props.disabled,
  })
})
</script>

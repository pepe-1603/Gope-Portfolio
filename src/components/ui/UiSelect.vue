<template>
  <div class="space-y-1">
    <label v-if="label" :for="id" class="text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label }}
    </label>
    <div class="relative">
      <div
        v-if="$slots.icon"
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
      >
        <slot name="icon" />
      </div>
      <select
        :id="id"
        :value="modelValue"
        @change="updateValue"
        :disabled="disabled"
        :class="selectStyles"
      >
        <option v-if="placeholder" disabled value="">{{ placeholder }}</option>
        <option v-for="option in options" :key="option.value as string" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-700 dark:text-gray-300"
      >
        <svg
          class="h-5.5 w-5.5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>
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
    modelValue: string | null | undefined // Ajustamos para aceptar null
    placeholder?: string
    disabled?: boolean
    errorMessage?: string
    intent?: FormFieldVariants['intent']
    // Nueva prop para las opciones
    options: { value: string | null; label: string }[]
  }>(),
  {
    disabled: false,
    intent: 'default',
    modelValue: null,
    placeholder: 'Selecciona una opción',
    options: () => [],
  },
)

const emit = defineEmits(['update:modelValue'])

const updateValue = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value === '' ? null : target.value)
}

const selectStyles = computed(() => {
  const iconPadding = props.options.some((option) => option.label.includes('')) ? 'pl-10' : 'pl-4'
  return (
    formFieldStyles({
      intent: props.disabled ? 'disabled' : props.errorMessage ? 'error' : props.intent,
    }) + ` appearance-none pr-10 ${iconPadding}`
  )
})
</script>

<template>
  <div class="space-y-1">
    <label v-if="label" :for="id" class="text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label }}
    </label>
    <div class="relative mt-1 rounded-md shadow-sm">
      <div
        v-if="$slots.icon"
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
      >
        <slot name="icon"></slot>
      </div>

      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="updateValue"
        :class="styles"
      />
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
    modelValue: string | number | null | undefined
    type?: string
    placeholder?: string
    disabled?: boolean
    errorMessage?: string
    intent?: FormFieldVariants['intent']
  }>(),
  {
    type: 'text',
    disabled: false,
    intent: 'default',
  },
)

const emit = defineEmits(['update:modelValue'])

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const styles = computed(() => {
  // Aquí ajustamos los estilos para agregar padding izquierdo si hay un slot de ícono
  const baseStyles = formFieldStyles({
    intent: props.disabled ? 'disabled' : props.errorMessage ? 'error' : props.intent,
  })

  // Agregar padding-left si el slot "icon" está presente
  const iconPadding = 'pl-10'

  if (baseStyles.includes('pl-') || baseStyles.includes('px-')) {
    return baseStyles.replace(/pl-\d+|px-\d+/, iconPadding)
  }

  // Si no hay padding horizontal, simplemente lo agregamos.
  return `${baseStyles} ${iconPadding}`
})
</script>

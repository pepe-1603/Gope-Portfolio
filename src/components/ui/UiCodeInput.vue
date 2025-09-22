<template>
  <div class="flex gap-2 justify-center">
    <div v-for="(_, index) in length" :key="index" class="relative">
      <input
        :ref="
          (el) => {
            if (el) inputRefs[index] = el as HTMLInputElement
          }
        "
        type="text"
        :value="codeArray[index]"
        maxlength="1"
        :disabled="disabled"
        autocomplete="off"
        class="text-center border rounded focus:outline-none focus:ring transition-all duration-150 w-10 h-12"
        :class="[
          colorClass.border,
          colorClass.text,
          sizeClass,
          shakeFlags[index] ? 'shake border-red-500' : '',
          successFlags[index] ? 'success-pulse' : '',
          disabled ? 'opacity-60 cursor-not-allowed' : '',
        ]"
        @input="handleInput($event, index)"
        @keydown.backspace="handleBackspace($event, index)"
        @paste="handlePaste($event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { inputColors, inputSizes } from '@/utils/codeInputStyles'

interface Props {
  modelValue: string
  length?: number
  type?: 'text' | 'number' | 'alphanumeric'
  color?: keyof typeof inputColors
  size?: keyof typeof inputSizes
  autoFocus?: boolean
  disabled?: boolean
  error?: boolean
  success?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  length: 6,
  type: 'number',
  color: 'indigo',
  size: 'md',
  autoFocus: true,
  disabled: false,
  error: false,
  success: false,
})

const shakeFlags = ref<boolean[]>(Array(props.length).fill(false))
const successFlags = ref<boolean[]>(Array(props.length).fill(false))
const emit = defineEmits(['update:modelValue', 'onComplete'])

const inputRefs = ref<HTMLInputElement[]>([])

const codeArray = computed(() => {
  return props.modelValue.padEnd(props.length, '').slice(0, props.length).split('')
})

const colorClass = computed(() => inputColors[props.color] || inputColors.indigo)
const sizeClass = computed(() => inputSizes[props.size] || inputSizes.md)

function focusNext(index: number) {
  if (index + 1 < props.length) inputRefs.value[index + 1]?.focus()
}

function focusPrev(index: number) {
  if (index > 0) inputRefs.value[index - 1]?.focus()
}

function handleInput(event: Event, index: number) {
  const input = event.target as HTMLInputElement
  let value = input.value

  if (!value) return

  if (props.type === 'number') value = value.replace(/[^0-9]/g, '')
  else if (props.type === 'alphanumeric') value = value.replace(/[^a-zA-Z0-9]/g, '')

  if (!value) {
    input.value = ''
    return
  }

  input.value = value[0]

  // Clonamos el arreglo actual de código
  const codeChars = [...codeArray.value]
  codeChars[index] = value[0]

  // Actualizamos solo el valor en la posición actual, sin modificar el resto.
  const newCode = codeChars.join('')

  // Emitimos el nuevo valor para actualizar el v-model
  emit('update:modelValue', newCode)

  // Solo hacemos focusNext si el valor en esa posición está definido y no está vacío
  // y además, solo si no estamos en la última posición
  if (index + 1 < props.length && value[0].trim() !== '') {
    nextTick(() => {
      inputRefs.value[index + 1]?.focus()
    })
  }

  // NO emitimos onComplete ni ninguna acción automática aquí
}

function handleBackspace(event: KeyboardEvent, index: number) {
  const input = event.target as HTMLInputElement
  if (!input.value && index > 0) focusPrev(index)
}

function handlePaste(event: ClipboardEvent) {
  event.preventDefault()
  const paste = event.clipboardData?.getData('text') || ''
  let value = paste.trim()

  if (props.type === 'number') value = value.replace(/[^0-9]/g, '')
  else if (props.type === 'alphanumeric') value = value.replace(/[^a-zA-Z0-9]/g, '')

  if (!value) return

  // Limitamos la cantidad de caracteres al máximo permitido
  const chars = value.slice(0, props.length).split('')

  // Emitimos el valor recortado pero NO emitimos onComplete ni ninguna otra acción automática
  emit('update:modelValue', chars.join(''))

  nextTick(() => {
    // Foco en la última posición pegada
    const nextIndex = Math.min(chars.length, props.length - 1)
    inputRefs.value[nextIndex]?.focus()
  })
}

watch(
  () => props.length,
  () => {
    inputRefs.value = []
    nextTick(() => {
      if (props.autoFocus && !props.disabled) inputRefs.value[0]?.focus()
    })
  },
  { immediate: true },
)

watch(
  () => props.success,
  (newVal) => {
    if (newVal) {
      successFlags.value = Array(props.length).fill(true)
      setTimeout(() => {
        successFlags.value = Array(props.length).fill(false)
      }, 800)
    }
  },
)

// Para resetear inputs cuando hay error:
watch(
  () => props.error,
  (newVal) => {
    if (newVal) {
      // Limpiar el input
      emit('update:modelValue', '')
      inputRefs.value.forEach((input) => (input.value = ''))
      shakeFlags.value = Array(props.length).fill(true)
      setTimeout(() => {
        shakeFlags.value = Array(props.length).fill(false)
      }, 400)
    }
  },
)
</script>

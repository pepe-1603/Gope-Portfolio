<template>
  <div class="flex items-center space-x-2">
    <label
      :for="id"
      :class="[
        'relative scale-90 inline-block h-7 w-[48px] cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] dark:bg-gray-700',
        {
          'peer-checked:bg-[#1976D2]': !props.disabled,
          'opacity-50 cursor-not-allowed': props.disabled,
        },
      ]"
    >
      <input
        :id="id"
        type="checkbox"
        :checked="modelValue"
        :disabled="disabled"
        @change="updateValue"
        class="peer sr-only"
      />

      <span
        :class="[
          'absolute inset-y-0 start-0 m-1 size-5 rounded-full bg-gray-300 ring-[5px] ring-inset ring-white transition-all',
          {
            'opacity-50': props.disabled,
            'peer-checked:start-7 peer-checked:w-2 peer-checked:bg-white peer-checked:ring-transparent':
              !props.disabled,
          },
        ]"
      ></span>
    </label>

    <span v-if="props.label" class="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label }}
    </span>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    id: string
    label?: string
    modelValue: boolean
    disabled?: boolean
  }>(),
  {
    disabled: false,
    label: '',
  },
)

const emit = defineEmits(['update:modelValue'])

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>

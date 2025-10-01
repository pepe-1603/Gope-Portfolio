<template>
  <div class="collapsible-container">
    <button
      class="collapsible-header"
      @click="toggle"
      :aria-expanded="isExpanded"
      :aria-controls="`collapsible-content-${_uid}`"
    >
      <div class="flex items-center gap-3">
        <font-awesome-icon
          :icon="faPlus"
          :class="{ 'rotate-45': isExpanded }"
          class="collapsible-icon"
        />
        <span class="collapsible-title">{{ title }}</span>
      </div>
    </button>

    <div
      ref="contentRef"
      class="collapsible-content-wrapper"
      :style="{ maxHeight: isExpanded ? contentHeight : '0' }"
      @transitionend="handleTransitionEnd"
    >
      <div :id="`collapsible-content-${_uid}`" class="collapsible-content p-4">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, getCurrentInstance } from 'vue'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

defineProps({
  title: {
    type: String,
    required: true,
  },
})

const isExpanded = ref(false)
const contentRef = ref<HTMLElement | null>(null)
const contentHeight = ref('0px')

const toggle = () => {
  isExpanded.value = !isExpanded.value
}

watch(isExpanded, async (newValue) => {
  if (newValue) {
    await nextTick()
    if (contentRef.value) {
      contentHeight.value = `${contentRef.value.scrollHeight}px`
    }
  } else {
    contentHeight.value = '0px'
  }
})

// Define la función para manejar el final de la transición
const handleTransitionEnd = (event: Event) => {
  // Cuando se termina de abrir (isExpanded es true)
  if (isExpanded.value && contentRef.value) {
    // Establecer maxHeight a 'none' o 'auto' para que el contenido se ajuste si cambia
    contentHeight.value = 'none'
  }
}
// 💡 Nota: Usar 'Event' es un tipo seguro. Si usas 'TransitionEvent' puedes necesitar una importación.

// 💡 Nota: Puedes importar 'TransitionEvent' para un tipado más estricto si lo deseas,
// pero solo declararla como una función ya resuelve el error de existencia (TS2339).

// Generar un ID único para accesibilidad
const instance = getCurrentInstance()
const _uid = instance ? instance.uid : 0
</script>

<style scoped>
.collapsible-container {
  @apply rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md transition-all duration-300;
}

.collapsible-header {
  @apply w-full p-4 flex justify-between items-center text-left focus:outline-none;
}

.collapsible-title {
  @apply text-lg font-semibold text-gray-800 dark:text-gray-200;
}

.collapsible-icon {
  @apply w-4 h-4 text-gray-500 dark:text-gray-400 transform transition-transform duration-300;
}

.collapsible-content-wrapper {
  @apply overflow-hidden transition-[max-height] ease-in-out duration-500;
}
</style>

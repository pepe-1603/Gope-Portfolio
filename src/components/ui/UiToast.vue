<template>
  <Transition
    enter-from-class="translate-x-full opacity-0"
    enter-active-class="transition transform duration-300 ease-out"
    leave-to-class="translate-x-full opacity-0"
    leave-active-class="transition transform duration-300 ease-in"
  >
    <div :class="styles">
      <div class="flex-shrink-0">
        <font-awesome-icon :icon="iconForIntent" class="w-5 h-5" />
      </div>

      <div class="flex-1 ml-3 pr-2">
        <p class="font-bold mb-1">{{ toast.type.toUpperCase() }}</p>
        <p class="text-base">{{ toast.message }}</p>
      </div>

      <div v-if="toast.isClosable" class="ml-auto pl-3 -my-1">
        <button
          @click="emit('close')"
          class="rounded-md p-1.5 opacity-70 hover:opacity-100"
          aria-label="Cerrar notificación"
        >
          <font-awesome-icon :icon="faXmark" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  faXmark,
  faCheckCircle,
  faCircleXmark,
  faCircleInfo,
  faTriangleExclamation,
  faRocket,
  faLightbulb, // ✅ faRocket ya está importado
} from '@fortawesome/free-solid-svg-icons'
import { type Toast } from '@/stores/toast' // ✅ Importa el tipo Toast
import { toastStyles, type ToastVariants } from '@/utils/toastStyles'

const props = defineProps<{
  // ✅ La prop 'intent' no es necesaria si ya pasas el objeto 'toast'
  //    Lo que te pasaste fue `intent?: toast: Toast`, lo ajustaremos a:
  toast: Toast
}>()

// 2. Definimos los eventos que el componente puede emitir
const emit = defineEmits(['close'])

// 3. Se usa la propiedad 'type' del objeto toast para los íconos y estilos
const iconForIntent = computed(() => {
  switch (props.toast.type) {
    case 'success':
      return faCheckCircle
    case 'error':
      return faCircleXmark
    case 'info':
      return faCircleInfo
    case 'warning':
      return faTriangleExclamation
    // ✅ Añade el nuevo caso para 'new-feature' y 'upcoming'
    case 'new-feature':
      return faRocket
    case 'upcoming':
      return faLightbulb // Usamos el mismo ícono para ambas variantes
    default:
      return faCircleInfo
  }
})

const styles = computed(() => {
  // ✅ Se asegura que el tipo de intent sea el correcto para CVA
  return toastStyles({
    intent: props.toast.type as ToastVariants['intent'],
  })
})
</script>

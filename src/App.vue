<script setup lang="ts">
import { onMounted, watch, ref, onBeforeUnmount } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useOnline } from '@vueuse/core'
import { useThemeStore } from './stores/theme'
import { useToastStore } from './stores/toast'
import { useModalStore } from './stores/modal'
import ToastContainer from './components/ui/ToastContainer.vue'
import ModalContainer from './components/ui/modals/ModalContainer.vue'
import UiLoader from './components/ui/UiLoader.vue'
import { useUiStore } from './stores/uiStore'

const router = useRouter()
const route = useRoute() // Importa useRoute para acceder a la ruta actual
const uiStore = useUiStore()
const modalStore = useModalStore()
const toastStore = useToastStore()
const themeStore = useThemeStore()
const isOnline = useOnline()

const OFFLINE_MODAL_NAME = 'OfflineModal'
const NO_INTERNET_MODAL_NAME = 'NoInternetModal'

let connectivityCheckTimeout: ReturnType<typeof setTimeout> | null = null
let connectivityInterval: ReturnType<typeof setInterval> | null = null

const hasRealInternet = ref<boolean | null>(null)
const secondLayerShown = ref(false)

// Verificación real de acceso a Internet
const checkRealConnection = async () => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
      method: 'GET',
      cache: 'no-store',
    })

    if (response.ok) {
      if (!hasRealInternet.value && secondLayerShown.value) {
        toastStore.addToast({
          message: '¡Conexión a Internet restablecida!',
          type: 'success',
          duration: 3000,
        })
      }
      hasRealInternet.value = true
      secondLayerShown.value = false
      modalStore.closeModal()
    } else {
      hasRealInternet.value = false
      secondLayerShown.value = true
      modalStore.openModal(NO_INTERNET_MODAL_NAME, {}, false)
    }
  } catch (error) {
    hasRealInternet.value = false
    secondLayerShown.value = true
    modalStore.openModal(NO_INTERNET_MODAL_NAME, {}, false)
  }
}

// Iniciar monitoreo recurrente si hay red
const startConnectivityMonitoring = () => {
  if (connectivityInterval) clearInterval(connectivityInterval)
  connectivityInterval = setInterval(() => {
    checkRealConnection()
  }, 5000)
}

// Detener monitoreo
const stopConnectivityMonitoring = () => {
  if (connectivityInterval) {
    clearInterval(connectivityInterval)
    connectivityInterval = null
  }
}

// Observar cambios de conexión de red (capa 1)
watch(
  isOnline,
  (onlineStatus) => {
    if (onlineStatus) {
      if (connectivityCheckTimeout) clearTimeout(connectivityCheckTimeout)
      connectivityCheckTimeout = setTimeout(() => {
        checkRealConnection()
        startConnectivityMonitoring()
      }, 1000)
    } else {
      stopConnectivityMonitoring()
      hasRealInternet.value = false
      secondLayerShown.value = false
      modalStore.closeModal()
      modalStore.openModal(OFFLINE_MODAL_NAME, {}, false)
    }
  },
  { immediate: true },
)

// Eventos nativos
window.addEventListener('online', () => {
  checkRealConnection()
  startConnectivityMonitoring()
})

window.addEventListener('offline', () => {
  stopConnectivityMonitoring()
  hasRealInternet.value = false
  secondLayerShown.value = false
  modalStore.closeModal()
  modalStore.openModal(OFFLINE_MODAL_NAME, {}, false)
})

// Verificar al navegar entre rutas
router.afterEach(() => {
  if (navigator.onLine) {
    checkRealConnection()
  } else {
    modalStore.closeModal()
    modalStore.openModal(OFFLINE_MODAL_NAME, {}, false)
  }
})

// Modo oscuro reactivo
watch(
  () => themeStore.isDarkMode,
  (newVal) => {
    if (newVal) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  },
  { immediate: true },
)

// Manejar el loader de rutas
router.beforeEach((to, from, next) => {
  uiStore.setLoading(true) // Activa el loader antes de la navegación
  next()
})

router.afterEach(() => {
  uiStore.setLoading(false) // Desactiva el loader una vez la navegación ha terminado
})

// Verificación inicial
onMounted(() => {
  if (!isOnline.value) {
    modalStore.openModal(OFFLINE_MODAL_NAME, {}, false)
  } else {
    checkRealConnection()
    startConnectivityMonitoring()
  }
})

// Limpiar monitoreo al desmontar
onBeforeUnmount(() => {
  stopConnectivityMonitoring()
})
</script>

<template>
  <div>
    <UiLoader />
    <ToastContainer />
    <ModalContainer />

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" :key="route.fullPath" />
      </transition>
    </router-view>
  </div>
</template>

<style>
/* CSS para la transición 'fade' */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Recomendación para mejorar la experiencia:
  Si quieres evitar que los usuarios hagan clic mientras la transición está activa,
  puedes añadir una clase que deshabilite los eventos del puntero.
*/
.fade-enter-active,
.fade-leave-active {
  pointer-events: none;
}
</style>

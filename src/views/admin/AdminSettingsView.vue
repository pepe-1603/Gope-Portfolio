<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold dark:text-gray-100 mb-6">Configuración de Administrador</h2>

    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <p class="text-gray-600 dark:text-gray-400">
        Aquí podrás configurar opciones de la aplicación, como la apariencia, los usuarios o los
        permisos.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <UiCard class="md:col-span-1">
          <template #header>
            <div class="flex items-start space-x-4">
              <div
                class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400"
              >
                <font-awesome-icon :icon="['fas', 'palette']" class="text-xl" />
              </div>

              <div class="flex-grow">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Tema de la Interfaz
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Cambia entre el modo claro y oscuro para adaptar la apariencia a tu preferencia.
                </p>
              </div>
            </div>
          </template>

          <div class="flex justify-start items-center gap-3 -mt-4">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Tema actual:
              <span
                :class="{
                  'bg-gray-200 dark:bg-gray-700': !isDarkMode,
                  'bg-gray-300 dark:bg-gray-600': isDarkMode,
                }"
                class="text-xs font-semibold px-2 py-1 rounded-full ml-1"
              >
                {{ isDarkMode ? 'Oscuro' : 'Claro' }}
              </span>
            </p>
            <ThemeSwitch />
          </div>
        </UiCard>

        <UiCard class="md:col-span-2">
          <template #header>
            <div class="flex items-start space-x-4">
              <div
                class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
              >
                <font-awesome-icon :icon="['fas', 'language']" class="text-xl" />
              </div>
              <div class="flex-grow">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Configuración de Idioma
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Esta aplicación se muestra en un solo idioma. Puedes usar la extensión de tu
                  navegador para traducir la página.
                </p>
              </div>
            </div>
          </template>

          <UiAlert title="Sugerencia de Traducción" intent="info">
            <p class="text-gray-600 dark:text-gray-400">
              La mayoría de los navegadores modernos, como Chrome, Edge y Firefox, tienen una
              función de traducción integrada. Si el idioma de tu navegador no es español, verás una
              ventana emergente para traducir esta página automáticamente.
            </p>
          </UiAlert>
        </UiCard>

        <UiCard class="md:col-span-2">
          <template #header>
            <div class="flex items-start space-x-4">
              <div
                class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
              >
                <font-awesome-icon :icon="['fas', 'shield-alt']" class="text-xl" />
              </div>
              <div class="flex-grow">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Seguridad y Privacidad
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Gestiona opciones importantes como tu contraseña, la autenticación de dos factores
                  y la visibilidad de tu perfil público.
                </p>
              </div>
            </div>
          </template>

          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="font-medium text-gray-800 dark:text-gray-200">Cambiar Contraseña</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Actualiza tu contraseña para mantener tu cuenta segura.
                </p>
              </div>
              <UiButton variant="outline" size="sm" @click="openPasswordModal">Cambiar</UiButton>
            </div>

            <UiDivider class="!my-0" />

            <div class="flex items-center justify-between">
              <div>
                <h4 class="font-medium text-gray-800 dark:text-gray-200">
                  Autenticación de Dos Factores (2FA)
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Añade una capa extra de seguridad a tu cuenta.
                </p>
              </div>
              <div class="flex items-center gap-2">
                <span
                  class="text-sm font-medium"
                  :class="is2faEnabled ? 'text-green-500' : 'text-gray-500'"
                >
                  {{ is2faEnabled ? 'Activado' : 'Desactivado' }}
                </span>
                <UiButton
                  v-if="!is2faEnabled"
                  type="button"
                  intent="primary"
                  size="sm"
                  @click="handle2FAToggle(true)"
                  :disabled="isToggling"
                >
                  <span v-if="isToggling" class="flex items-center gap-1">
                    <font-awesome-icon :icon="['fas', 'spinner']" spin />
                    Cargando...
                  </span>
                  <span v-else>Activar</span>
                </UiButton>
                <UiButton
                  v-else
                  type="button"
                  intent="danger"
                  size="sm"
                  @click="handle2FAToggle(false)"
                  :disabled="isToggling"
                >
                  <span v-if="isToggling" class="flex items-center gap-1">
                    <font-awesome-icon :icon="['fas', 'spinner']" spin />
                    Cargando...
                  </span>
                  <span v-else>Desactivar</span>
                </UiButton>
              </div>
            </div>

            <UiDivider class="!my-0" />

            <div class="flex items-center justify-between">
              <div>
                <h4 class="font-medium text-gray-800 dark:text-gray-200">Perfil Público</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Controla si tu perfil es visible para el público.
                </p>
              </div>
              <UiSwitch
                v-model="isPublicProfile"
                @update:model-value="handleProfileVisibilityToggle"
                id="profile-switch"
              />
            </div>
          </div>
        </UiCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="AdminSettingsView">
import { ref, watch } from 'vue'
import ThemeSwitch from '@/components/common/ThemeSwitch.vue'
import UiCard from '@/components/ui/UiCard.vue'
import UiAlert from '@/components/ui/UiAlert.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiSwitch from '@/components/ui/UiSwitch.vue'
import UiDivider from '@/components/UiDivider.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPalette, faLanguage, faShieldAlt, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useThemeStore } from '@/stores/theme'
import { storeToRefs } from 'pinia'
import { useToast } from '@/composables/useToast'
import { useGlobalModal } from '@/composables/useGlobalModal'
import ChangePasswordModal from '@/components/ui/modals/ChangePasswordModal.vue'
import InfoModal from '@/components/ui/modals/InfoModal.vue'
import Setup2faModal from '@/components/ui/modals/Setup2faModal.vue'
import { disableAll2faFactors, findAndRemoveOrphanedFactors } from '@/services/authService'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

library.add(faPalette, faLanguage, faShieldAlt, faSpinner)

const modal = useGlobalModal()
const themeStore = useThemeStore()
const { isDarkMode } = storeToRefs(themeStore)
const toast = useToast()
const router = useRouter()
const authStore = useAuthStore()

const is2faEnabled = ref(false)
const isPublicProfile = ref(true)
const isToggling = ref(false)

watch(
  () => authStore.user?.factors,
  (factors) => {
    is2faEnabled.value = !!factors?.length
  },
  { immediate: true },
)

const handle2FAToggle = async (activate: boolean) => {
  isToggling.value = true
  if (activate) {
    // ✅ PASO 1: Limpiar factores huérfanos antes de continuar.
    await findAndRemoveOrphanedFactors()

    if (is2faEnabled.value) {
      toast.info('La autenticación de dos factores ya está habilitada.')
      isToggling.value = false
      return
    }

    const result = await modal.showModal(Setup2faModal, {}, { closeOnClickOutside: false })
    if (result.action === 'confirm') {
      await authStore.checkAuth()
      toast.success('2FA ha sido habilitado con éxito.')
    } else {
      is2faEnabled.value = false
      toast.info('Configuración de 2FA cancelada.')
    }
  } else {
    if (!is2faEnabled.value) {
      toast.info('La autenticación de dos factores ya está deshabilitada.')
      isToggling.value = false
      return
    }

    const confirmResult = await modal.showModal(
      InfoModal,
      {
        title: 'Desactivar 2FA',
        message: '¿Estás seguro de que quieres deshabilitar la autenticación de dos factores?',
        intent: 'danger',
      },
      { closeOnClickOutside: false },
    )
    if (confirmResult.action === 'confirm') {
      try {
        const factorId = authStore.user?.factors?.[0]?.id
        if (!factorId) {
          toast.error('No se encontró el factor 2FA para deshabilitar.')
          is2faEnabled.value = true
          isToggling.value = false
          return
        }
        await disableAll2faFactors()
        await authStore.checkAuth()
        toast.warning('2FA ha sido deshabilitado de tu cuenta.')
        toast.success(
          '2FA ha sido deshabilitado de tu cuenta. Ya no necesitas el código al iniciar sesión.',
          6000,
        )
      } catch (error) {
        console.error('Error al deshabilitar 2FA:', error)
        toast.error('Ocurrió un error al deshabilitar 2FA. Por favor, intenta de nuevo.')
        is2faEnabled.value = true
      }
    } else if (confirmResult.action === 'cancel' || confirmResult.action === 'close') {
      is2faEnabled.value = true
    }
  }
  isToggling.value = false
}

const openPasswordModal = async () => {
  const result = await modal.showModal(
    ChangePasswordModal,
    {},
    {
      closeOnClickOutside: false,
    },
  )

  if (result.action === 'confirm') {
    toast.success('La contraseña ha sido actualizada con éxito.')
    setTimeout(async () => {
      const modalResult = await modal.showModal(
        InfoModal,
        { title: 'Importante', message: 'Necesitas volver a iniciar sesión para continuar...' },
        {},
      )
      if (
        modalResult.action === 'confirm' ||
        modalResult.action === 'cancel' ||
        modalResult.action === 'close'
      ) {
        router.push({ name: 'login' })
      }
    }, 100)
  } else if (result.action === 'cancel') {
    toast.info('Cambio de contraseña cancelado.')
  } else if (result.action === 'close') {
    toast.error('Ocurrió un error al cambiar la contraseña.')
  }
}

const handleProfileVisibilityToggle = (value: boolean) => {
  toast.newFeature(
    `La visibilidad del perfil se ha ${value ? 'habilitado' : 'deshabilitado'}. Esta función es una simulación.`,
  )
}
</script>

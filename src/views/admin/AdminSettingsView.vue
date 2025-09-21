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
              <UiSwitch
                v-model="is2faEnabled"
                @update:model-value="handle2FAToggle"
                id="2fa-switch"
              />
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

<script setup lang="ts">
import { ref } from 'vue'
import ThemeSwitch from '@/components/common/ThemeSwitch.vue'
import UiCard from '@/components/ui/UiCard.vue'
import UiAlert from '@/components/ui/UiAlert.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiSwitch from '@/components/ui/UiSwitch.vue'
import UiDivider from '@/components/UiDivider.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPalette, faLanguage, faShieldAlt } from '@fortawesome/free-solid-svg-icons'
import { useThemeStore } from '@/stores/theme'
import { storeToRefs } from 'pinia'
import { useToast } from '@/composables/useToast'
import { useGlobalModal } from '@/composables/useGlobalModal'
import ChangePasswordModal from '@/components/ui/modals/ChangePasswordModal.vue'

library.add(faPalette, faLanguage, faShieldAlt)

const modal = useGlobalModal()
const themeStore = useThemeStore()
const { isDarkMode } = storeToRefs(themeStore)
const toast = useToast()

const is2faEnabled = ref(false)
const isPublicProfile = ref(true)

const handle2FAToggle = (value: boolean) => {
  if (value) {
    // Si se activa, muestra un toast de "nueva función"
    toast.newFeature(
      'La autenticación de dos factores estará disponible en una próxima actualización. ¡Mantente atento!',
    )
  } else {
    // Si se desactiva, puedes mostrar un toast de "próximamente" o una nota similar
    toast.upcoming(
      'Hemos notificado a nuestro equipo sobre tu interés en esta función. ¡Gracias por tu paciencia!',
    )
  }
}

const handleProfileVisibilityToggle = (value: boolean) => {
  if (value) {
    // Si se hace público, muestra un toast de "nueva función"
    toast.newFeature(
      '¡Pronto podrás controlar la visibilidad de tu perfil público! Esta función está en desarrollo.',
    )
  } else {
    // Si se hace privado, muestra un toast de "próximamente"
    toast.upcoming('La configuración de visibilidad del perfil estará disponible próximamente.')
  }
}

// ✅ Función para abrir el modal de cambio de contraseña
const openPasswordModal = async () => {
  const result = await modal.showModal(
    ChangePasswordModal,
    {},
    {
      // Opcional, si tu modal global usa un título si el modal no tiene uno fijo
      closeOnClickOutside: false,
    },
  )

  if (result.action === 'confirm') {
    toast.success('La contraseña ha sido actualizada con éxito.')
  } else if (result.action === 'cancel') {
    toast.info('Cambio de contraseña cancelado.')
  } else if (result.action === 'close') {
    toast.error('Ocurrió un error al cambiar la contraseña.')
  }
}
</script>

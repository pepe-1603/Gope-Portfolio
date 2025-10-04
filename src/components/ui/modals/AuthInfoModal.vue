<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import UiButton from '../UiButton.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faLock,
  faShieldHalved,
  faUser,
  faUserCheck,
  faWarning,
} from '@fortawesome/free-solid-svg-icons'

library.add(faWarning, faUser, faShieldHalved, faLock, faUserCheck)

const props = defineProps({
  __onConfirm: {
    type: Function,
    required: true,
  },
})

const handleAccept = () => {
  props.__onConfirm({ accepted: true })
}
</script>

<template>
  <div class="flex flex-col items-center py-1 justify-center text-center">
    <div
      class="flex items-center justify-center w-20 h-20 rounded-full mb-6 shadow-inner bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
    >
      <FontAwesomeIcon icon="fas fa-shield-halved" class="text-4xl" />
    </div>
    <h1 class="text-3xl font-extrabold mb-2 text-gray-900 dark:text-white">Acceso Restringido</h1>
    <p class="text-lg mb-4 px-4 text-gray-600 dark:text-gray-400">
      Para continuar, debes iniciar sesión. Este panel es exclusivo para el propietario
      <FontAwesomeIcon icon="fas fa-user" />.
    </p>

    <UiButton class="w-full sm:w-auto mt-2" intent="info" @click="handleAccept"> Aceptar </UiButton>
  </div>
</template>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Iniciar Sesión</h2>
    <p class="text-gray-600 dark:text-gray-400 mb-6">
      Ingresa tus credenciales para acceder a tu cuenta.
    </p>

    <form @submit.prevent="handleLogin">
      <div class="mb-4">
        <label for="email" class="block text-gray-700 dark:text-gray-300">Correo electrónico</label>
        <input type="email" id="email" class="w-full mt-1 p-2 border rounded-md" />
      </div>
      <div class="mb-6">
        <label for="password" class="block text-gray-700 dark:text-gray-300">Contraseña</label>
        <input type="password" id="password" class="w-full mt-1 p-2 border rounded-md" />
      </div>
      <div class="flex justify-end">
        <button
          type="button"
          @click="close"
          class="mr-2 px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
        >
          Cancelar
        </button>
        <button type="submit" class="px-4 py-2 rounded-md bg-blue-500 text-white">Acceder</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue'
import { useModal } from '@/composables/useModal'

export default defineComponent({
  name: 'LoginModal',
  props: {
    // Aquí puedes recibir las props que le pases al abrir el modal
    initialEmail: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    // Importamos el composable para tener acceso a la función de cierre
    const { close } = useModal()

    const handleLogin = () => {
      // Lógica para iniciar sesión
      // ...
      // Después de la lógica, cierra el modal
      close()
    }

    return {
      handleLogin,
      close,
    }
  },
})
</script>

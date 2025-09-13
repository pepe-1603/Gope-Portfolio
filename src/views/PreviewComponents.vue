<script setup lang="ts" name="PreviewCompoents">
// pagina depruebna par acompeontes test
import ThemeSwitch from '@/components/common/ThemeSwitch.vue'
import UiAlert from '@/components/ui/UiAlert.vue'
import UiBadge from '@/components/ui/UiBadge.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiCard from '@/components/ui/UiCard.vue'
import UiCheckbox from '@/components/ui/UiCheckbox.vue'
import UiFile from '@/components/ui/UiFile.vue'
import UiFormField from '@/components/ui/UiFormField.vue'
import UiRadio from '@/components/ui/UiRadio.vue'
import UiSelect from '@/components/ui/UiSelect.vue'
import UiSwitch from '@/components/ui/UiSwitch.vue'
import UiTextarea from '@/components/ui/UiTextarea.vue'
import UiDivider from '@/components/UiDivider.vue'
import {
  CircleStackIcon,
  PhoneIcon,
  SpeakerWaveIcon,
  TagIcon,
  TicketIcon,
} from '@heroicons/vue/20/solid'
import { ref } from 'vue'

import { useToast } from '@/composables/useToast'
import SkeletonListProjects from '@/components/ui/skeletons/SkeletonListProjects.vue'
import SkeletonListTechs from '@/components/ui/skeletons/SkeletonListTechs.vue'
import SkeletonListExperience from '@/components/ui/skeletons/SkeletonListExperience.vue'
import StatusIndicator from '@/components/ui/StatusIndicator.vue'

const name = ref('')
const email = ref('')
const password = ref('')
const username = ref('usuario_deshabilitado')
// Variables reactivas para controlar el estado de los switches
const isDarkModeActive = ref(false)
const receiveUpdates = ref(true)
const notificationsEnabled = ref(false) // Esta variable se controlará internamente pero el switch estará deshabilitado

// 1. Importa y usa el composable
const toast = useToast()

// Funciones para mostrar los toasts
const showNewFeatureToast = () => {
  // Usa el tipo 'new-feature' que definimos.
  toast.showToast('¡Una nueva funcionalidad está disponible ahora!', 'new-feature')
}

const showUpComingToast = () => {
  // Usa el tipo 'upcoming'.
  toast.showToast('¡Próximamente! Una gran actualización está en camino.', 'upcoming')
}

const showNewInfoToast = () => {
  // Usa el método de conveniencia para 'info'.
  toast.info('Este es un mensaje de información.')
}

const showNewErrorToast = () => {
  // Usa el método de conveniencia para 'error'.
  toast.error('Ocurrió un error inesperado.')
}

const showNewWarningToast = () => {
  // Usa el método de conveniencia para 'warning'.
  toast.warning('Hay un problema que requiere tu atención.')
}

const showNewSuccessToast = () => {
  // Usa el método de conveniencia para 'success'.
  toast.success('¡Operación exitosa!')
}

const showNewDefaultToast = () => {
  // Usa el método 'showToast' con el tipo 'default'.
  toast.showToast('Este es el toast por defecto.', 'default')
}

toast.warning('Este es un warning.')
toast.info('Este Es un Toast informativo.')
toast.showToast('Preview Toast default !', 'default', 10000, false)

const handleLoginSuccess = () => {
  // 2. Llama al método de conveniencia 'success'
  // El composable se encarga de todo: añadir el toast al store,
  // y que este aparezca en pantalla.
  toast.success('¡Bienvenido! Has iniciado sesión correctamente.')
}

const handleLoginError = () => {
  // 3. Usa el método 'error' para un mensaje de fallo
  toast.error('Credenciales incorrectas. Inténtalo de nuevo.')
}

const form = ref({
  bio: '',
  country: '',
  terms: false,
})

const form2 = ref({
  contactMethod: 'email',
  newsletter: false,
  document: null as FileList | null,
})

const isDarkMode = ref(false)

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark', isDarkMode.value)
}

const settings = ref({
  notifications: true,
  betaFeatures: false,
})
</script>

<template>
  <div class="about">
    <div class="p-8 space-y-4">
      <div class="inline-flex items-center justify-center px-1 py-0.5 gap-1">
        <div class="inline-flex items-center justify-center rounded-full bg-green-200/65 p-1">
          <div class="size-2 rounded-full bg-green-500 animate-spin"></div>
        </div>
        <p class="text-gray-600 text-xs self-end">Conectado</p>
      </div>

      <br /><br />
      <div class="p-8 space-y-4">
        <StatusIndicator />

        <StatusIndicator color="red" animated />

        <StatusIndicator size="lg" text="En línea" />

        <StatusIndicator color="blue" size="xl" text="Conectado" animated />
        <StatusIndicator color="rose" size="xs" text="Desconectado" animated />
        <StatusIndicator color="green" text="Online" animated />
      </div>

      <div class="p-4 divider-x divide-x-4 space-x-4">
        <UiButton @click="showNewFeatureToast">Mostrar Novedad</UiButton>
        <UiButton @click="showUpComingToast">Mostrar UpComing</UiButton>
        <UiButton @click="showNewInfoToast">Mostrar Info</UiButton>
        <UiButton @click="showNewErrorToast">Mostrar Error</UiButton>
        <UiButton @click="showNewWarningToast">Mostrar warning</UiButton>
        <UiButton @click="showNewSuccessToast">Mostrar success</UiButton>
        <UiButton @click="showNewDefaultToast">Mostrar Default</UiButton>
      </div>
    </div>

    <div class="container mx-auto p-6">
      <h1>Seccion de Componentes Genericos y Skeletons</h1>
      <UiDivider :icon="TicketIcon" color="green" label="List Projects" />
      <SkeletonListProjects />
      <UiDivider :icon="TagIcon" color="blue" label="List Techs" />
      <SkeletonListTechs />
      <UiDivider :icon="PhoneIcon" color="purple" label="List Experience" />
      <SkeletonListExperience />
    </div>

    <div :class="{ 'dark bg-gray-900 text-white': isDarkMode }" class="p-8 space-y-8 min-h-screen">
      <ThemeSwitch />

      <div class="max-w-sm mx-auto">
        <h1 class="text-3xl font-bold mb-6">Formulario Completo</h1>

        <button
          @click="toggleDarkMode"
          class="mb-6 p-2 rounded-md bg-gray-200 dark:bg-gray-700 dark:text-white"
        >
          Alternar Modo Oscuro
        </button>

        <form class="space-y-4">
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Método de contacto preferido
            </label>
            <div class="mt-2 space-y-2">
              <UiRadio
                id="radio-email"
                name="contact"
                value="email"
                label="Correo electrónico"
                v-model="form2.contactMethod"
              />
              <UiRadio
                id="radio-phone"
                name="contact"
                value="phone"
                label="Teléfono"
                v-model="form2.contactMethod"
              />
            </div>
          </div>

          <UiCheckbox
            id="newsletter"
            label="Suscribirme al boletín de noticias"
            v-model="form2.newsletter"
          />

          <UiFile
            id="document"
            label="Adjuntar documento"
            accept=".pdf,.doc,.docx"
            v-model="form2.document"
          />

          <UiSwitch
            id="notifications"
            label="Recibir notificaciones por correo"
            v-model="settings.notifications"
          />

          <UiSwitch id="dark-mode-toggle" label="Activar modo oscuro" v-model="isDarkMode" />

          <UiSwitch
            id="feature-beta"
            label="Activar funciones Beta"
            v-model="settings.betaFeatures"
            disabled
          />

          <UiButton intent="primary" full-width>Enviar</UiButton>
        </form>
        <br /><br />

        <UiCard>
          <template #header>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">Tarjeta de Perfil</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Desarrollador de software</p>
          </template>

          <p class="text-gray-600 dark:text-gray-300">
            Esta es una tarjeta de ejemplo que muestra cómo se puede estructurar la información
            usando los slots.
          </p>

          <template #footer>
            <UiButton intent="secondary">Cancelar</UiButton>
            <UiButton intent="primary">Guardar</UiButton>
          </template>
        </UiCard>
      </div>
    </div>
    <div :class="{ 'dark bg-gray-900 text-white': isDarkMode }" class="p-8 space-y-8 min-h-screen">
      <div class="max-w-sm mx-auto">
        <h1 class="text-3xl font-bold mb-6">Formulario de Registro</h1>
        <button
          @click="toggleDarkMode"
          class="mb-6 p-2 rounded-md bg-gray-200 dark:bg-gray-700 dark:text-white"
        >
          Alternar Modo Oscuro
        </button>

        <form class="space-y-4">
          <UiTextarea
            id="bio"
            label="Biografía"
            placeholder="Escribe algo sobre ti..."
            v-model="form.bio"
          />

          <UiSelect
            id="country"
            label="País"
            v-model="form.country"
            placeholder="Selecciona tu país"
          >
            <option value="mx">México</option>
            <option value="es">España</option>
            <option value="us">Estados Unidos</option>
          </UiSelect>

          <UiCheckbox id="terms" label="Acepto los términos y condiciones" v-model="form.terms" />

          <UiButton full-width>Enviar</UiButton>
        </form>
      </div>
    </div>

    <div class="mx-auto p-4 shadow">
      <h1>This is an about page</h1>
      <button class="bg-primary hover:bg-primary-dark">Haz clic</button>
      <span class="text-accent">¡Destacado!</span>
      <p class="text-text-light dark:text-text-dark">Este texto se adapta al tema.</p>
      <p class="text-secondary-light dark:text-secondary-dark">Este texto se adapta al tema.</p>

      <div class="m-2 p-4 border">
        <h1 class="text-xl">Hola</h1>
        <p class="">Lorem, ipsum dolor. <span class="border-b border-b-white">link</span></p>
      </div>

      <div class="p-8 space-y-4">
        <h1 class="text-3xl font-bold">Botones Personalizados</h1>
      </div>
    </div>
    <div class="mt-2">
      <h1 class="text-3xl font-bold">Botones con estilo Outline</h1>

      <div class="flex md:flex-col space-y-4">
        <UiButton intent="primary">Botón Primario (Indigo)</UiButton>
        <UiButton intent="secondary">Botón Secundario</UiButton>
        <UiButton intent="danger" :full-width="true">Botón Peligro</UiButton>
        <UiButton intent="warning">Botón Peligro</UiButton>
        <UiButton intent="purple-power" size="sm">Botón Poder Púrpura</UiButton>
        <UiButton intent="info" size="lg">Botón Info (Azul)</UiButton>
        <UiButton intent="ghost">Botón Fantasma</UiButton>
        <UiButton intent="link">Botón Enlace</UiButton>

        <UiButton fullWidth>Botón Ancho Completo</UiButton>
        <button class="bg-gray-600 w-fit p-2 rounded focus:outline-indigo-500">btn primary</button>
        <button
          class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded transition duration-300"
        >
          Haz Clic Aquí
        </button>
      </div>
      <div class="p-8 space-y-4 max-w-lg mx-auto">
        <h1 class="text-3xl font-bold">Componente UiAlert</h1>

        <UiAlert
          intent="success"
          title="¡Operación exitosa!"
          description="Los cambios se han guardado correctamente."
        />

        <UiAlert
          intent="warning"
          variant="outline"
          title="Advertencia"
          description="Hay un problema que requiere tu atención."
        />
        <UiAlert
          intent="success"
          title="¡Operación exitosa!"
          variant="outline"
          description="Los cambios se han guardado correctamente."
          dismissible
        />

        <UiAlert
          intent="danger"
          title="Error de conexión"
          description="No se pudo establecer la conexión con el servidor."
          dismissible
        />

        <UiAlert intent="info" variant="outline" title="Notificación">
          <p>
            Este es un mensaje de información.
            <a href="#" class="font-bold underline">Haz clic aquí</a>
            para más detalles.
          </p>
        </UiAlert>
        <UiAlert intent="danger" variant="outline" title="Error Inesperado">
          <p>
            Este es un mensage Error.
            <a href="#" class="font-bold underline">Haz clic aquí</a>
            para más detalles.
          </p>
        </UiAlert>
        <UiAlert intent="info" title="Error Inesperado">
          <p>
            Este es un mensage Error.
            <a href="#" class="font-bold underline">Haz clic aquí</a>
            para más detalles.
          </p>
        </UiAlert>
      </div>
      <div class="p-8 space-y-4 max-w-sm mx-auto relative">
        <h1 class="text-3xl font-bold">Componente UiToast</h1>

        <div class="flex flex-col space-y-4">
          <div class="p-8 space-y-1">
            <h1 class="text-2xl font-bold mb-4">Iniciar Sesión</h1>
            <button @click="handleLoginSuccess" class="bg-green-500 text-white p-3 rounded-md mr-2">
              Login Exitoso
            </button>
            <button @click="handleLoginError" class="bg-red-500 text-white p-3 rounded-md">
              Login Fallido
            </button>
            <button class="bg-indigo-500 text-white p-3 rounded-md">Abrir Login</button>

            <button class="px-4 py-2 rounded-md bg-orange-500 text-white">Eliminar Item #42</button>
          </div>

          <div class="p-8">
            <h1 class="text-2xl font-bold mb-4">Olvidé mi Contraseña</h1>
            <input
              type="email"
              v-model="email"
              placeholder="Tu correo electrónico"
              class="w-full p-2 mb-4 border rounded"
            />
            <button class="bg-blue-500 text-white p-3 rounded-md">Restablecer Contraseña</button>
          </div>
        </div>
      </div>
    </div>
    <div class="p-8 space-y-8 max-w-sm mx-auto">
      <h1 class="text-3xl font-bold">Componente UiFormField</h1>

      <form class="space-y-4">
        <UiFormField
          id="name"
          label="Nombre completo"
          placeholder="Ej: Juan Pérez"
          v-model="name"
        />

        <UiFormField
          id="email"
          label="Correo electrónico"
          placeholder="ejemplo@correo.com"
          v-model="email"
          intent="success"
        />

        <UiFormField
          id="password"
          label="Contraseña"
          type="password"
          v-model="password"
          errorMessage="La contraseña debe tener al menos 8 caracteres."
        />

        <UiFormField id="username" label="Nombre de usuario" v-model="username" disabled />
      </form>

      <pre>name: {{ name }}</pre>
      <pre>email: {{ email }}</pre>
      <pre>password: {{ password }}</pre>
    </div>
  </div>
  <div class="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
    <h2 class="text-xl font-bold mb-6 text-gray-900 dark:text-white">Configuración</h2>

    <div class="mb-4">
      <UiSwitch id="darkMode" label="Activar modo oscuro" v-model="isDarkModeActive" />
    </div>

    <div class="mb-4">
      <UiSwitch
        id="receiveUpdates"
        label="Recibir actualizaciones del producto"
        v-model="receiveUpdates"
      />
    </div>

    <div class="mb-4">
      <UiSwitch
        id="notifications"
        label="Habilitar notificaciones (deshabilitado)"
        v-model="notificationsEnabled"
        :disabled="true"
      />
    </div>

    <p class="mt-8 text-gray-700 dark:text-gray-300">
      Estado del modo oscuro: {{ isDarkModeActive ? 'Activo' : 'Inactivo' }}
    </p>
    <p class="text-gray-700 dark:text-gray-300">
      Recibir actualizaciones: {{ receiveUpdates ? 'Sí' : 'No' }}
    </p>

    <div class="m-2 p-4 sace-y-2">
      <UiBadge color="blue" text="lorem"></UiBadge>
      <UiBadge color="gray" text="Badge"></UiBadge>
      <UiBadge color="green" text="Badge"></UiBadge>
      <UiBadge color="indigo" text="Badge"></UiBadge>
      <UiBadge color="pink" text="Badge"></UiBadge>
      <UiBadge color="purple" text="Badge"></UiBadge>
      <UiBadge color="red" text="Badge"></UiBadge>
      <UiBadge color="yellow" text="Badge"></UiBadge>
      <UiBadge color="indigo" size="xs" text="Badge"></UiBadge>
      <UiBadge color="blue" size="sm" text="Badge"></UiBadge>
      <UiBadge color="blue" size="md" text="Badge"></UiBadge>
      <UiBadge color="blue" size="lg" text="Badge"></UiBadge>
      <UiBadge color="blue" size="xl" text="Badge"></UiBadge>
      <UiBadge color="indigo" size="xs" text="Badge" :icon="CircleStackIcon"></UiBadge>
      <UiBadge color="blue" size="sm" text="Badge" :icon="SpeakerWaveIcon"></UiBadge>
      <UiBadge color="blue" size="md" text="Badge" :icon="PhoneIcon"></UiBadge>
      <UiBadge color="blue" size="lg" text="Badge" :icon="TagIcon"></UiBadge>
      <UiBadge color="blue" size="xl" text="Bad" :icon="TicketIcon"></UiBadge>
    </div>

    <UiDivider label="Seccion Toast globales" />
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>

//src/main.ts
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import modalPlugin from './plugins/modalPlugin'

// Importaciones de Font Awesome
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useAuthStore } from './stores/authStore'

// Nota: aquí NO importamos los íconos, solo el core y el componente.
// Los íconos se importarán en cada componente que los necesite.

const app = createApp(App)
const pinia = createPinia()

// 1. Instala el plugin de persistencia
pinia.use(piniaPluginPersistedstate)

// 2. Vincula Pinia a la aplicación ANTES de usar cualquier store
app.use(pinia)

// 3. Ahora puedes usar el store de forma segura
// Carga el estado de autenticación antes de montar la app
const authStore = useAuthStore()
await authStore.checkAuth()

// 4. Instala otros plugins y el router
app.use(modalPlugin)
app.use(router)

// Registramos el componente de Font Awesome globalmente
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')

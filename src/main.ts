//src/main.ts
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

// Importaciones de Font Awesome
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Nota: aquí NO importamos los íconos, solo el core y el componente.
// Los íconos se importarán en cada componente que los necesite.

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

// Registramos el componente de Font Awesome globalmente
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')

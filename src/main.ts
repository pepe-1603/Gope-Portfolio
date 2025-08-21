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

// Esperar a que el DOM esté listo y luego mostrar la app y ocultar el loader.
// Usar el evento 'DOMContentLoaded' es una opción más rápida que 'load' si solo necesitas
// saber que el DOM ya está listo, ya que no espera por las imágenes y otros recursos.
window.addEventListener(
  'DOMContentLoaded',
  () => {
    const loader = document.getElementById('loader')
    const appElement = document.getElementById('app')

    if (loader) {
      loader.classList.add('hidden')
    }

    if (appElement) {
      //appElement.style.display = 'block'; // O remueve la clase de ocultar de Tailwind
      appElement.classList.remove('hidden')
    }
  },
  { once: true },
) // Usar 'once: true' asegura que el evento se ejecute solo una vez

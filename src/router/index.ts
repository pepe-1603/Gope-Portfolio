import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useToastStore } from '@/stores/toast'
import BaseLayout from '@/layout/BaseLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: BaseLayout, // Utiliza el layout como componente principal
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
        },
        {
          path: '/about',
          name: 'about-me',
          component: () => import('@/views/AboutView.vue'),
        },
        {
          path: '/proyectos',
          name: 'projects',
          // Carga perezosa de la nueva vista de proyectos
          component: () => import('@/views/project/ProjectsView.vue'),
        },
        {
          path: '/proyectos/:slug',
          name: 'project-detail',
          // Carga perezosa de la vista de detalle
          component: () => import('@/views/project/Slug.vue'),
        },
      ],
    },
    // Podrías tener otro layout para el panel de administración
    // {
    //   path: '/admin',
    //   component: AdminLayout,
    //   children: [ ... ]
    // }
  ],
})

//Agfregamos el hook dde navegacion global
router.beforeEach((to, from, next) => {
  //Obtenemos una instancia del store de Toasts
  const toastStore = useToastStore()

  //Lammamos al metodo para limpiar toast los toast
  toastStore.clearToasts()

  ///continuamos con la navegacion
  next()
})

export default router

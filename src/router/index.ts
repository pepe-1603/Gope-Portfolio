import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BaseLayout from '@/layout/BaseLayout.vue'
import AdminLayout from '@/layout/AdminLayout.vue'
import { nextTick } from 'vue'
import AuthLayout from '@/layout/AuthLayout.vue'
import AuthHomeView from '@/views/auth/AuthHomeView.vue'
import { handleAuthGuards } from '@/composables/useRouterAuth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: BaseLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
        },
        {
          path: '/test',
          name: 'test-preview',
          component: () => import('@/views/PreviewComponents.vue'),
        },
        {
          path: '/about',
          name: 'about-me',
          component: () => import('@/views/AboutView.vue'),
        },
        {
          path: '/proyectos',
          name: 'projects',
          component: () => import('@/views/project/ProjectsView.vue'),
        },
        {
          path: '/proyectos/:slug',
          name: 'project-detail',
          component: () => import('@/views/project/ProjectSlug.vue'),
        },
      ],
    },
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true, requiredRole: 'admin' },
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/AdminDashboard.vue'),
        },
        // ✅ CORRECCIÓN: La ruta anidada no lleva barra inicial
        {
          path: 'projects',
          name: 'admin-projects',
          component: () => import('@/views/admin/ProjectManagementView.vue'),
        },
        {
          path: 'projects/:id/preview',
          name: 'admin-project-preview',
          component: () => import('@/views/admin/ProjectPreviewView.vue'),
          props: true, // Esto permite que el `id` se pase como prop al componente
        },
        // ✅ AÑADIDO: Ruta anidada para tecnologías
        {
          path: 'technologies',
          name: 'admin-techs',
          component: () => import('@/views/admin/TechManagementView.vue'),
        },
        // ✅ NUEVA RUTA PARA LA VISTA DE TECNOLOGÍA
        {
          path: 'technologies/:id/preview',
          name: 'admin-tech-preview',
          component: () => import('@/views/admin/TechPreviewView.vue'),
          props: true,
        },
        {
          // ✅ NUEVA RUTA: Ruta para la configuración de admin
          path: 'settings',
          name: 'admin-settings',
          component: () => import('../views/admin/AdminSettingsView.vue'),
        },
        {
          path: 'experience',
          name: 'admin-experience',
          component: () => import('@/views/admin/ExperienceManagementView.vue'),
        },
        {
          path: 'storage',
          name: 'admin-storage',
          component: () => import('@/views/admin/StorageManagementView.vue'),
        },
        {
          path: 'profile',
          name: 'admin-profile',
          component: () => import('@/views/admin/AdminProfileView.vue'),
        },
      ],
    },
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        {
          path: '', // La ruta vacía (o "") hace que sea la vista por defecto para /auth
          name: 'auth-home',
          component: AuthHomeView,
        },
        {
          path: '/login',
          name: 'login',
          component: () => import('@/views/auth/AdminLoginView.vue'),
        },
      ],
    },
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue'), // O el nombre de tu vista 404
    },
  ],
})

router.beforeEach(handleAuthGuards)

export default router

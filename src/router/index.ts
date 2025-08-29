import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BaseLayout from '@/layout/BaseLayout.vue'
import AdminLayout from '@/layout/AdminLayout.vue'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toast'
import { useGlobalModal } from '@/composables/useGlobalModal'
import AuthInfoModal from '@/components/ui/modals/AuthInfoModal.vue'
import { nextTick } from 'vue'


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
          component: () => import('@/views/project/Slug.vue'),
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
      ],
    },
    {
      path: '/admin-login',
      name: 'admin-login',
      component: () => import('@/views/auth/AdminLoginView.vue'),
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const toastStore = useToastStore()
  const authStore = useAuthStore()
  const $modal = useGlobalModal();

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiredRole = to.meta.requiredRole

  if (requiresAuth) {
    if (!authStore.isAuthenticated) {
      toastStore.addToast({
        message: 'Necesitas iniciar sesión para acceder al panel de administración.',
        type: 'warning',
        duration: 6000,
      })

      try {
        const modalResult = await $modal.showModal(
          AuthInfoModal,
          {},
          { closeOnClickOutside: false }
        );

        if (modalResult?.action === 'confirm' && modalResult.payload?.accepted) {
          next({ name: 'admin-login' });
        } else {
          next({ name: 'home' });
        }
      } catch (error) {
        next({ name: 'home' });
      }
    } else if (requiredRole && (!authStore.profile || authStore.profile.role !== requiredRole)) {
      toastStore.addToast({
        message: 'No tienes permisos de administrador para acceder a esta sección.',
        type: 'error',
        duration: 6000,
      })
      next({ name: 'home' })
    } else {
      next();
    }
  } else {
    next();
  }
})

export default router

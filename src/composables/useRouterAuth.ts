import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toast'
import { useGlobalModal } from '@/composables/useGlobalModal'
import AuthInfoModal from '@/components/ui/modals/AuthInfoModal.vue'
import NoAuthNeededModal from '@/components/ui/modals/NoAuthNeededModal.vue'
// ✅ IMPORTACIÓN DE TIPOS DE VUE ROUTER
import type {
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
  NavigationGuardNext,
} from 'vue-router'

export const handleAuthGuards = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalizedLoaded,
  next: NavigationGuardNext,
) => {
  const toastStore = useToastStore()
  const authStore = useAuthStore()
  const $modal = useGlobalModal()

  // Caso 1: Usuario logueado intenta ir a la página de login
  if (to.name === 'login' && authStore.isAuthenticated) {
    await $modal.showModal(NoAuthNeededModal)
    next({ name: 'home' })
    return
  }
  // Caso 2: Tipar 'record' dentro del .some
  const requiresAuth = to.matched.some(
    (record: { meta: { requiresAuth?: boolean } }) => record.meta.requiresAuth,
  )
  const requiredRole = to.meta.requiredRole as string

  // Caso 2: Ruta requiere autenticación
  if (requiresAuth) {
    if (!authStore.isAuthenticated) {
      toastStore.addToast({
        message: 'Necesitas iniciar sesión para acceder al panel de administración.',
        type: 'warning',
        duration: 6000,
      })
      try {
        const modalResult = await $modal.showModal(AuthInfoModal)
        if (modalResult?.action === 'confirm' && modalResult.payload?.accepted) {
          next({ name: 'login' })
        } else {
          next({ name: 'home' })
        }
      } catch (error) {
        next({ name: 'home' })
      }
    } else if (requiredRole && (!authStore.profile || authStore.profile.role !== requiredRole)) {
      toastStore.addToast({
        message: 'No tienes permisos de administrador para acceder a esta sección.',
        type: 'error',
        duration: 6000,
      })
      next({ name: 'home' })
    } else {
      next()
    }
  } else {
    next()
  }
}

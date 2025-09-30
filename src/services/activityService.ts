// src/services/activityService.ts
import supabase from '@/lib/supabaseClient'
import { useAuthStore } from '@/stores/authStore'
import type { ActivityAction, ActivityResourceType, AdminActivity } from '@/types/activity.d.ts'

/**
 * Servicio para obtener el log de actividad reciente de los administradores.
 */
export const activityService = {
  /**
   * Obtiene las últimas N acciones de actividad, ordenadas por fecha descendente.
   * @param limit El número máximo de entradas a retornar (por defecto 10).
   * @returns Un array de objetos AdminActivity.
   */
  async getRecentActivity(limit: number = 10): Promise<AdminActivity[]> {
    console.log(`Fetching last ${limit} admin activities...`)

    const { data, error } = await supabase
      .from('admin_activities') // 🛑 NOTA: Asegúrate de que esta tabla exista en tu DB.
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching activity log:', error)
      // En un entorno real, podrías querer manejar errores de forma más sofisticada
      throw new Error('No se pudo cargar el log de actividad.')
    }

    // El resultado debe coincidir con la interfaz AdminActivity
    return (data as AdminActivity[]) || []
  },

  /**
   * Registra una nueva entrada en el log de actividad de administrador.
   * @param action El tipo de acción ('CREATE', 'UPDATE', 'DELETE', etc.).
   * @param resourceType El tipo de recurso afectado ('project', 'tech', etc.).
   * @param description Una descripción legible del evento.
   * @param resourceId El ID del recurso afectado (opcional).
   */
  async logActivity(
    action: ActivityAction,
    resourceType: ActivityResourceType,
    description: string,
    resourceId: string | null = null,
  ): Promise<void> {
    // 🛑 CORRECCIÓN: Instanciamos el store DENTRO de la función o justo antes de usar el servicio.
    // Pinia stores deben usarse dentro de un componente Vue/Pinia o instanciarse
    // de esta forma en un servicio (aunque es mejor usar la forma asíncrona de Supabase
    // para mayor solidez, aquí usaremos Pinia dado que ya lo importaste).

    // Obtenemos la instancia del store Pinia
    const authStore = useAuthStore()

    // 🛑 CORRECCIÓN: Inicializamos userEmail con un valor por defecto.
    let userEmail: string = 'System/Unknown'

    if (authStore.isAuthenticated && authStore.user) {
      // Obtenemos el email del usuario logueado.
      userEmail = authStore.user.email || userEmail
    } else {
      // Alternativa sólida: Siempre consultar a Supabase por si Pinia no está hidratado.
      // const user = (await supabase.auth.getUser()).data.user;
      // userEmail = user?.email || 'System/Unknown';
    }

    const { error } = await supabase.from('admin_activities').insert({
      user_email: userEmail,
      action: action,
      resource_type: resourceType,
      description: description,
      resource_id: resourceId,
    })

    if (error) {
      console.error('Error logging activity:', error)
      // Mantener sin throw para no bloquear la operación principal
    }
  },
}

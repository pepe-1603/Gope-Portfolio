// src/services/statsService.ts
import supabase from '@/lib/supabaseClient'

/**
 * Obtiene las estadísticas clave para el dashboard.
 * @returns Un objeto con los conteos y el proyecto reciente.
 */

// Asume que tienes un servicio para obtener el uso total del almacenamiento.
// Si no existe, tendrás que crearlo o usar la API de Supabase Storage directamente.
// Usaremos un valor mock para este ejemplo o un endpoint que asumes existe.

// --- Definición de la función de stats (Ejemplo con un valor Mock) ---
export const statsService = {
  async getDashboardStats() {
    // Conteo de proyectos
    const { count: projectsCount, error: projectsError } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })

    // Conteo de tecnologías
    const { count: techsCount, error: techsError } = await supabase
      .from('techs')
      .select('*', { count: 'exact', head: true })

    // Conteo de experiencias
    const { count: experienceCount, error: experienceError } = await supabase
      .from('work_experience')
      .select('*', { count: 'exact', head: true })

    // Último proyecto actualizado (o creado)
    const { data: latestProject, error: latestError } = await supabase
      .from('projects')
      .select('id, title, updated_at')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    // ✅ NUEVA LÓGICA: Obtener uso de almacenamiento
    // NOTA: La API de Supabase para obtener el uso total de un bucket requiere la API de administración.
    // Usaremos un valor mock temporalmente:
    const storageUsageBytes = 2147483648 // Ejemplo: 2 GB

    if (projectsError || techsError || experienceError || latestError) {
      console.error(
        'Error fetching dashboard stats:',
        projectsError || techsError || experienceError || latestError,
      )
      throw new Error('No se pudieron cargar las estadísticas del dashboard.')
    }

    return {
      projects: projectsCount || 0,
      technologies: techsCount || 0,
      experience: experienceCount || 0,
      latestProject: latestProject as { id: string; title: string; updated_at: string } | null,
      // ✅ RETORNAMOS LA NUEVA MÉTRICA
      storageUsageBytes: storageUsageBytes,
    }
  },
}

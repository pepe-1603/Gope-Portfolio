// src/services/statsService.ts
import supabase from '@/lib/supabaseClient'

/**
 * Obtiene las estadísticas clave para el dashboard.
 * @returns Un objeto con los conteos y el proyecto reciente.
 */

// Asume que tienes un servicio para obtener el uso total del almacenamiento.
// Si no existe, tendrás que crearlo o usar la API de Supabase Storage directamente.
// Usaremos un valor mock para este ejemplo o un endpoint que asumes existe.

// ✅ NUEVO TIPO DE DATO PARA LA RESPUESTA DE LA GRÁFICA
export interface TechDistribution {
  name: string
  project_count: number
}

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

  /**
   * Obtiene la distribución de proyectos por tecnología (nombre y conteo).
   * @returns Una promesa que resuelve con un array de TechDistribution.
   */
  async getTechDistribution(): Promise<TechDistribution[]> {
    console.log('Fetching project distribution by technology...')

    // 1. Ejecutar la consulta sin el filtro neq('project_techs.count', 0)
    const { data, error } = await supabase
      .from('techs')
      .select(
        `
                name,
                project_techs(count)
            `,
      )
      // ✅ CORREGIDO: Usamos la sintaxis del fix anterior para el ORDER
      .order('count', {
        ascending: false,
        foreignTable: 'project_techs',
      })

    if (error) {
      console.error('Error fetching tech distribution:', error)
      throw new Error('No se pudo cargar la distribución de tecnologías.')
    }

    // 2. Mapeamos y filtramos los datos en el cliente (TypeScript)
    const distribution = data
      // Primero, Mapeamos el formato de Supabase a TechDistribution
      .map((item: any) => ({
        name: item.name,
        // Supabase devuelve el conteo en un array [{ count: N }]
        project_count: item.project_techs.length > 0 ? item.project_techs[0].count : 0,
      }))
      // ✅ APLICAMOS EL FILTRO EN TYPESCRIPT: Solo si el conteo es > 0
      .filter((item) => item.project_count > 0)

    return distribution
  },
}

// src/services/projectService.ts

import supabase from '@/lib/supabaseClient'
import type { Tables, TablesInsert, TablesUpdate } from '@/types/supabase'
import type { ProjectWithTechs } from '@/types/project'
import { activityService } from './activityService'

const PROJECTS_TABLE = 'projects'

// ✅ AÑADIDO: Define el tipo de dato para la respuesta paginada
export interface PaginatedResponse<T> {
  data: T[] | null
  count: number | null
}

/**
 * Servicio para interactuar con la tabla de 'projects' en Supabase.
 * Proporciona métodos para obtener, crear, actualizar y eliminar proyectos.
 */
export const projectService = {
  /**
   * Obtiene una lista de todos los proyectos sin paginación.
   * @returns {Promise<Tables<'projects'>[] | null>} Una promesa que resuelve con un array de proyectos o null.
   */
  getAllProjectsWithoutPagination: async (): Promise<Tables<'projects'>[] | null> => {
    try {
      const { data, error } = await supabase
        .from(PROJECTS_TABLE)
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching all projects:', error.message)
        throw error
      }

      return data
    } catch (error) {
      console.error('Error in getAllProjects:', error)
      throw error
    }
  },

  /**
   * Obtiene una lista de todos los proyectos.
   * @returns {Promise<Tables<'projects'>[] | null>} Una promesa que resuelve con un array de proyectos o null.
   */
  getAllProjects: async (
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<Tables<'projects'>>> => {
    try {
      const start = page * limit
      const end = start + limit - 1

      // ✅ CAMBIO: Usamos `select` con `count: 'exact'` y `range`
      const { data, count, error } = await supabase
        .from(PROJECTS_TABLE)
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(start, end)

      if (error) {
        console.error('Error fetching all projects:', error.message)
        throw error
      }
      return { data, count }
    } catch (error) {
      console.error('Error in getAllProjects:', error)
      throw error
    }
  },

  /**
   * Obtiene una lista paginada de proyectos.
   * @param page El número de página (basada en 0, no en 1).
   * @param limit La cantidad de elementos por página.
   * @returns {Promise<PaginatedResponse<Tables<'projects'>>>} Una promesa que resuelve con los datos y el conteo total.
   */
  getPaginatedProjects: async (
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<Tables<'projects'>>> => {
    try {
      const start = page * limit
      const end = start + limit - 1

      // ✅ CAMBIO: Usamos `select` con `count: 'exact'` y `range`
      const { data, count, error } = await supabase
        .from(PROJECTS_TABLE)
        .select('* , project_techs(techs(*))', { count: 'exact' })
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .range(start, end)

      if (error) {
        console.error('Error fetching paginated projects:', error.message)
        throw error
      }
      // ✅ RETORNA AMBOS: datos y conteo
      return { data, count }
    } catch (error) {
      console.error('Error in getPaginatedProjects:', error)
      throw error
    }
  },

  /**
   * Obtiene un proyecto por su ID, con sus tecnologías asociadas.
   * @param id El ID del proyecto.
   * @returns {Promise<ProjectWithTechs | null>} Una promesa que resuelve con un objeto de proyecto, incluyendo sus tecnologías, o null.
   */
  getProjectById: async (id: string): Promise<ProjectWithTechs | null> => {
    try {
      const { data, error } = await supabase
        .from(PROJECTS_TABLE)
        .select('*, project_techs(techs(*))')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          console.warn(`Project with ID ${id} not found.`)
          return null
        }
        console.error('Error fetching project by ID:', error.message)
        throw error
      }
      return data as ProjectWithTechs
    } catch (error) {
      console.error('Error in getProjectById:', error)
      throw error
    }
  },

  /**
   * Obtiene un proyecto por su slug, con sus tecnologías asociadas.
   * @param slug El slug del proyecto.
   * @returns {Promise<ProjectWithTechs | null>} Una promesa que resuelve con un objeto de proyecto, incluyendo sus tecnologías, o null.
   */
  getProjectBySlug: async (slug: string): Promise<ProjectWithTechs | null> => {
    try {
      const { data, error } = await supabase
        .from(PROJECTS_TABLE)
        .select('*, project_techs(techs(*))')
        .eq('slug', slug)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          console.warn(`Project with slug '${slug}' not found.`)
          return null
        }
        console.error('Error fetching project by slug:', error.message)
        throw error
      }
      return data as ProjectWithTechs
    } catch (error) {
      console.error('Error in getProjectBySlug:', error)
      throw error
    }
  },

  /**
   * Crea un nuevo proyecto en la base de datos.
   * @param projectData Los datos del nuevo proyecto.
   * @returns {Promise<Tables<'projects'>>} Una promesa que resuelve con el objeto del proyecto creado.
   */
  createProject: async (projectData: TablesInsert<'projects'>): Promise<Tables<'projects'>> => {
    try {
      // 1. Ejecutar la operación principal (crear el proyecto)
      const { data, error } = await supabase
        .from(PROJECTS_TABLE)
        .insert([projectData as TablesInsert<'projects'>]) // Siempre array para inserciones simples
        .select()
        .single()
      if (error) {
        console.error('Error creating project:', error.message)
        throw error
      }
      // 2. Ejecutar el Log de Actividad (SOLO si la operación fue exitosa)
      await activityService.logActivity(
        'CREATE', // Acción
        'project', // Tipo de Recurso
        `Proyecto '${projectData.title}' creado exitosamente.`, // Descripción
        projectData.id, // ID del Recurso creado
      )

      return data
    } catch (error) {
      console.error('Error in createProject:', error)
      throw error
    }
  },

  /**
   * Actualiza un proyecto existente.
   * @param id El ID del proyecto a actualizar.
   * @param projectData Los datos a actualizar del proyecto.
   * @returns {Promise<Tables<'projects'>>} Una promesa que resuelve con el objeto del proyecto actualizado.
   */
  updateProject: async (
    id: string,
    projectData: TablesUpdate<'projects'>, // ✅ Corregido
  ): Promise<Tables<'projects'>> => {
    try {
      const { data, error } = await supabase
        .from(PROJECTS_TABLE)
        .update(projectData as TablesUpdate<'projects'>) // Forzar el tipo
        .eq('id', id)
        .select()
        .single()

      console.log('data service:', data)
      // ✅ LOG DE ACTIVIDAD: Creación
      await activityService.logActivity(
        'UPDATE',
        'project', // Tipo de Recurso
        `Projecto '${projectData.title}' actualizado.`, // Descripción
        projectData.id,
      )

      if (error) {
        console.error('Error updating project:', error.message, error)
        throw error
      }

      // Si no se encontró el proyecto (data es null)
      if (!data) {
        const notFoundError = new Error('No se encontró el proyecto para actualizar.') as any
        notFoundError.code = 'PGRST116'
        throw notFoundError
      }

      // ✅ INTEGRACIÓN DEL LOG: Registrar la actualización
      await activityService.logActivity(
        'UPDATE',
        'project',
        `Proyecto '${projectData.title || id}' actualizado.`,
        projectData.id,
      )

      console.log('Proyecto actualizado con éxito:', data)
      return data
    } catch (error) {
      console.error('Error in updateProject:', error)
      throw error
    }
  },

  /**
   * Actualiza las tecnologías asociadas a un proyecto.
   * @param projectId El ID del proyecto.
   * @param techIds Los IDs de las tecnologías seleccionadas.
   * @returns {Promise<void>}
   */
  updateProjectTechs: async (projectId: string, techIds: string[]): Promise<void> => {
    try {
      console.log('Iniciando actualización de tecnologías para el proyecto:', projectId)
      console.log('IDs de tecnologías a insertar:', techIds)
      const { error: deleteError } = await supabase
        .from('project_techs')
        .delete()
        .eq('project_id', projectId)

      if (deleteError) {
        console.error('Error al eliminar tecnologías de proyecto:', deleteError.message)
        throw deleteError
      }
      console.log('Tecnologías existentes eliminadas con éxito.')

      if (techIds.length > 0) {
        // 🛑 CORRECCIÓN: Usar TablesInsert para forzar el tipo del array
        const inserts: TablesInsert<'project_techs'>[] = techIds.map((techId) => ({
          project_id: projectId,
          tech_id: techId,
        }))
        console.log('Registros a insertar:', inserts)
        // El casting 'as any' puede ser necesario si TS aún se queja del tipo interno del array
        const { error: insertError } = await supabase.from('project_techs').insert(inserts as any) // ✅ Usar 'as any' si el error persiste, o si no estás 100% seguro del tipado de Postgrest

        if (insertError) {
          console.error('Error al insertar nuevas tecnologías:', insertError.message)
          throw insertError
        }
        console.log('Nuevas tecnologías insertadas con éxito.')
      }
    } catch (error) {
      console.error('Error en updateProjectTechs:', error)
      throw error
    }
  },

  /**
   * Crea un nuevo proyecto y sus tecnologías asociadas.
   * @param projectData Los datos del nuevo proyecto.
   * @param techIds Los IDs de las tecnologías a asociar.
   * @returns {Promise<Tables<'projects'>>} El proyecto creado.
   */
  createProjectAndTechs: async (
    projectData: TablesInsert<'projects'>, // ✅ Corregido
    techIds: string[],
  ): Promise<Tables<'projects'>> => {
    try {
      const newProject = await projectService.createProject(projectData)
      if (techIds && techIds.length > 0) {
        await projectService.updateProjectTechs(newProject.id, techIds)
      }
      return newProject
    } catch (error) {
      console.error('Error en createProjectAndTechs:', error)
      throw error
    }
  },

  /**
   * Actualiza un proyecto y sus tecnologías asociadas.
   * @param projectId El ID del proyecto a actualizar.
   * @param projectData Los datos del proyecto.
   * @param techIds Los IDs de las tecnologías a asociar.
   * @returns {Promise<Tables<'projects'>>} El proyecto actualizado.
   */
  updateProjectAndTechs: async (
    projectId: string,
    projectData: Tables<'projects'>['Update'],
    techIds: string[],
  ): Promise<Tables<'projects'>> => {
    try {
      if (!projectId) {
        console.error('El ID del proyecto no es válido.')
        throw new Error('El ID del proyecto no es válido.')
      }

      await projectService.updateProjectTechs(projectId, techIds)
      const updatedProject = await projectService.updateProject(projectId, projectData)
      return updatedProject
    } catch (error) {
      console.error('Error en updateProjectAndTechs:', error)
      throw error
    }
  },

  /**
   * Elimina un proyecto por su ID.
   * @param id El ID del proyecto a eliminar.
   * @returns {Promise<void>} Una promesa que no resuelve con ningún valor.
   */
  deleteProject: async (id: string): Promise<void> => {
    try {
      // Opcional: Obtener el título antes de eliminar para un log más descriptivo
      const projectToDelete = await projectService.getProjectById(id)
      const title = projectToDelete?.title || `ID: ${id}`
      const { error, status } = await supabase.from(PROJECTS_TABLE).delete().eq('id', id)
      if (error) {
        console.error('Error deleting project:', error.message)
        throw error
      }
      // ✅ INTEGRACIÓN DEL LOG: Registrar la eliminación
      await activityService.logActivity('DELETE', 'project', `Proyecto '${title}' eliminado.`, id)
      console.log(status, 'proyecto eliminado con id : ', id)
    } catch (error) {
      console.error('Error in deleteProject:', error)
      throw error
    }
  },
}

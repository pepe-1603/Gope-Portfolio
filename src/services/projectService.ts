// src/services/projectService.ts

import supabase from '@/lib/supabaseClient'
import type { Tables } from '@/types/supabase'
import type { ProjectWithTechs } from '@/types/project';

const PROJECTS_TABLE = 'projects'

/**
 * Servicio para interactuar con la tabla de 'projects' en Supabase.
 * Proporciona métodos para obtener, crear, actualizar y eliminar proyectos.
 */
export const projectService = {
  /**
   * Obtiene una lista de todos los proyectos.
   * @returns {Promise<Tables<'projects'>[] | null>} Una promesa que resuelve con un array de proyectos o null.
   */
  getAllProjects: async (): Promise<Tables<'projects'>[] | null> => {
    try {
      const { data, error } = await supabase.from(PROJECTS_TABLE).select('*')
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
   * Obtiene una lista paginada de proyectos.
   * @param page El número de página (empieza en 1).
   * @param itemsPerPage La cantidad de elementos por página.
   * @returns {Promise<Tables<'projects'>[] | null>} Una promesa que resuelve con un array de proyectos o null.
   */
  getProjectsByPage: async (
    page: number,
    itemsPerPage: number,
  ): Promise<Tables<'projects'>[] | null> => {
    try {
      const start = (page - 1) * itemsPerPage
      const end = start + itemsPerPage - 1

      const { data, error } = await supabase
        .from(PROJECTS_TABLE)
        .select('*')
        .order('created_at', { ascending: false }) // Opcional: ordenar por fecha de creación
        .range(start, end)

      if (error) {
        console.error('Error fetching paginated projects:', error.message)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error in getProjectsByPage:', error)
      throw error
    }
  },

  /**
   * Obtiene un proyecto y sus tecnologías asociadas por su slug.
   * Utiliza una función RPC (Remote Procedure Call) de Supabase.
   * Obtiene un proyecto por su slug, con sus tecnologías asociadas.
   * @param slug El slug del proyecto.
   * @returns {Promise<any | null>} Una promesa que resuelve con un objeto de proyecto, incluyendo sus tecnologías, o null.
   * @note El tipo de retorno es 'any' ya que las funciones RPC tienen una estructura de datos personalizada.
   */
  getProjectBySlug: async (slug: string): Promise<ProjectWithTechs | null> => {
    try {
      const { data, error } = await supabase.rpc('get_project_with_techs_by_slug_v2', {
        p_slug: slug,
      });

      console.log('Data RPC in Services: ', data)
      if (error) {
        console.error('Error fetching project by slug:', error.message);
        throw error;
      }
      // La RPC devuelve un array. Si el array tiene un elemento, lo devolvemos.
      if (data) {
        // Asegúrate de que el objeto devuelto coincida con la interfaz
        return data as ProjectWithTechs;
      }

      // Si no hay datos, retornamos null
      return null;


    } catch (error) {
      console.error('Error en getProjectBySlug:', error);
      throw error;
    }
  },

  /**
   * Crea un nuevo proyecto en la base de datos.
   * @param projectData Los datos del nuevo proyecto.
   * @returns {Promise<Tables<'projects'>>} Una promesa que resuelve con el objeto del proyecto creado.
   */
  createProject: async (
    projectData: Tables<'projects'>['Insert'],
  ): Promise<Tables<'projects'>> => {
    try {
      const { data, error } = await supabase
        .from(PROJECTS_TABLE)
        .insert(projectData)
        .select()
        .single() // Usamos .single() para obtener directamente el objeto
      if (error) {
        console.error('Error creating project:', error.message)
        throw error
      }
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
    projectData: Tables<'projects'>['Update'],
  ): Promise<Tables<'projects'>> => {
    try {
      const { data, error } = await supabase
        .from(PROJECTS_TABLE)
        .update(projectData)
        .eq('id', id)
        .select()
        .single()
      if (error) {
        console.error('Error updating project:', error.message)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error in updateProject:', error)
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
      const { error, status } = await supabase.from(PROJECTS_TABLE).delete().eq('id', id)

      setTimeout(()=>{
console.log(status, 'proyecto eliminado con id : ', id);
      }, 5000);
      if (error) {
        console.error('Error deleting project:', error.message)
        throw error
      }
    } catch (error) {
      console.error('Error in deleteProject:', error)
      throw error
    }
  },
}

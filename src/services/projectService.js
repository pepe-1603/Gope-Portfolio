// src/services/projectService.js

import supabase from '../lib/supabaseClient' // O la ruta correcta a tu supabaseClient.js

const PROJECTS_TABLE = 'projects'

export const projectService = {
  // READ (Público)
  getAllPublishedProjects: async () => {
    const { data, error } = await supabase
      .from(PROJECTS_TABLE)
      .select('*')
      .eq('is_published', true) // Solo proyectos publicados
      .order('created_at', { ascending: false }) // Ordenar por fecha de creación

    if (error) {
      console.error('Error al obtener proyectos publicados:', error.message)
      throw error
    }
    return data
  },

  // READ (Público)
  getProjectBySlug: async (slug) => {
    const { data, error } = await supabase
      .from(PROJECTS_TABLE)
      .select(
        `
        *,
        project_techs (
          techs (
            id,
            name,
            icon_url
          )
        )
      `,
      )
      .eq('slug', slug)
      .eq('is_published', true) // Solo si el proyecto está publicado
      .single() // Esperamos solo un resultado

    if (error) {
      console.error(`Error al obtener proyecto por slug ${slug}:`, error.message)
      throw error
    }
    return data
  },

  // CREATE (Administración)
  createProject: async (projectData) => {
    const { data, error } = await supabase.from(PROJECTS_TABLE).insert([projectData]).select() // Retorna el registro creado

    if (error) {
      console.error('Error al crear proyecto:', error.message)
      throw error
    }
    return data[0] // Retorna el primer (y único) objeto insertado
  },

  // UPDATE (Administración)
  updateProject: async (id, projectData) => {
    const { data, error } = await supabase
      .from(PROJECTS_TABLE)
      .update(projectData)
      .eq('id', id)
      .select()

    if (error) {
      console.error(`Error al actualizar proyecto con ID ${id}:`, error.message)
      throw error
    }
    return data[0]
  },

  // DELETE (Administración)
  deleteProject: async (id) => {
    const { error } = await supabase.from(PROJECTS_TABLE).delete().eq('id', id)

    if (error) {
      console.error(`Error al eliminar proyecto con ID ${id}:`, error.message)
      throw error
    }
    return true // Indicamos éxito
  },

  // ... puedes añadir más funciones específicas, como filtrar por tecnología, etc.
}

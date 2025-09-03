// src/types/project.d.ts

import type { Tables } from './supabase';

/**
 * Define la estructura de datos que retorna la función RPC
 * `get_project_with_techs_by_slug_v2` de Supabase.
 */
export interface ProjectWithTechs {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  live_url: string | null;
  repo_url: string | null;
  image_url: string | null;
  is_published: boolean | null;
  created_at: string;
  updated_at: string;
  // La propiedad `project_technologies` es un array de objetos 'techs'
  project_technologies: Tables<'techs'>[];
}

// src/types/project.d.ts
import type { Tables } from './supabase';

/**
 * Define la estructura de datos que retorna la consulta de proyectos con tecnologías.
 * Esta estructura refleja el `select('*, project_techs(techs(*))')` de Supabase.
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
  // La propiedad `project_techs` es un array de objetos intermedios.
  // Cada objeto intermedio contiene la tecnología completa.
  project_techs: {
    techs: Tables<'techs'>;
  }[];
}

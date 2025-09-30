// src/types/supabase.ts

/**
 * Este archivo contiene las definiciones de tipos para tu base de datos Supabase.
 * Se puede generar automáticamente con `supabase gen types`, pero para este
 * ejercicio, lo creamos manualmente basándonos en tu esquema.
 */
import type { User } from '@supabase/supabase-js' // ✅ CORRECCIÓN 1: Usar 'import type' (TS1484)

// ----------------------------------------------------------------------
// TIPOS DE UTILITY CRÍTICOS PARA INSERT/UPDATE
// ----------------------------------------------------------------------

// Tipo para la SELECCIÓN de datos (Rows)
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

// ✅ CORRECCIÓN 2: Tipo para INSERT
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

// ✅ CORRECCIÓN 3: Tipo para UPDATE
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          user_id: string | null
          name: string | null
          // ✅ CAMBIO 1: El nuevo campo para el Título Público/Profesional
          title: string | null
          //cambio 2: El neuvo cmapo parra una frase que acompaña al titulo
          tagline: string | null
          // ✅ CAMBIO 3: El rol se mantiene para la lógica de acceso (admin, viewer, etc.)
          role: 'admin' | 'viewer' | 'user' | null // Ajustado para incluir 'user'
          avatar: string | null
          bio: string | null
          github_url: string | null
          linkedin_url: string | null
          cv_url: string | null
        }
        Insert: Omit<Tables<'user_profiles'>, 'id'> & {
          id?: string
        }
        Update: Partial<Tables<'user_profiles'>>
      }
      projects: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          summary: string | null
          repo_url: string | null
          live_url: string | null
          image_url: string | null
          created_at: string | null
          updated_at: string | null
          is_published: boolean | null
        }
        Insert: Omit<Tables<'projects'>, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Tables<'projects'>>
      }
      techs: {
        Row: {
          id: string
          name: string
          icon_url: string | null
        }
        Insert: Omit<Tables<'techs'>, 'id'> & {
          id?: string
        }
        Update: Partial<Tables<'techs'>>
      }
      project_techs: {
        Row: {
          id: string
          project_id: string | null
          tech_id: string | null
        }
        Insert: Omit<Tables<'project_techs'>, 'id'> & {
          id?: string
        }
        Update: Partial<Tables<'project_techs'>>
      }
      work_experience: {
        Row: {
          id: string
          company: string
          role: string
          start_date: string | null
          end_date: string | null
          description: string | null
          project_id: string | null
        }
        Insert: Omit<Tables<'work_experience'>, 'id'> & {
          id?: string
        }
        Update: Partial<Tables<'work_experience'>>
      }
    }
  }
}

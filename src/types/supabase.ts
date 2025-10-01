// src/types/supabase.ts

/**
 * Este archivo contiene las definiciones de tipos para tu base de datos Supabase.
 * Se puede generar automáticamente con `supabase gen types`, pero para este
 * ejercicio, lo creamos manualmente basándonos en tu esquema.
 */
import type { User } from '@supabase/supabase-js'

// Utilidades para tipado de inserción y actualización
// ✅ CORRECCIÓN: Simplificamos Insertable para evitar conflictos de inferencia (quitando ID y volviéndolo opcional).
// Se asume que no hay created_at/updated_at en work_experience, si existieran, también irían aquí.
type Insertable<T> = Omit<T, 'id'> & { id?: string }
type Updatable<T> = Partial<T>

// 1. Primero define la interfaz Database
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          user_id: string | null
          name: string | null
          title: string | null
          tagline: string | null
          role: 'admin' | 'viewer' | 'user' | null
          avatar: string | null
          bio: string | null
          github_url: string | null
          linkedin_url: string | null
          cv_url: string | null
        }
        Insert: Insertable<Database['public']['Tables']['user_profiles']['Row']>
        Update: Updatable<Database['public']['Tables']['user_profiles']['Row']>
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
        // Nota: Para proyectos, OMITIMOS 'created_at' y 'updated_at' si son generados por la DB
        Insert: Insertable<
          Omit<Database['public']['Tables']['projects']['Row'], 'created_at' | 'updated_at'>
        > & {
          created_at?: string
          updated_at?: string
        }
        Update: Updatable<Database['public']['Tables']['projects']['Row']>
      }

      techs: {
        Row: {
          id: string
          name: string
          icon_url: string | null
        }
        Insert: Insertable<Database['public']['Tables']['techs']['Row']>
        Update: Updatable<Database['public']['Tables']['techs']['Row']>
      }

      project_techs: {
        Row: {
          id: string
          project_id: string | null
          tech_id: string | null
        }
        Insert: Insertable<Database['public']['Tables']['project_techs']['Row']>
        Update: Updatable<Database['public']['Tables']['project_techs']['Row']>
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
        // ✅ Mantener esta definición de 'Insert' para que TablesInsert funcione,
        // usando el Insertable simple.
        Insert: Insertable<Database['public']['Tables']['work_experience']['Row']>
        Update: Updatable<Database['public']['Tables']['work_experience']['Row']>
      }
    }
    // ...Views, Functions, Enums, etc. si tienes...
  }
}

// 2. Luego define los helpers usando la interfaz Database
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

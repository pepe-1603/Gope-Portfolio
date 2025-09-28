// src/types/activity.d.ts (O donde definas tus tipos globales)

export type ActivityAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT'
export type ActivityResourceType =
  | 'project'
  | 'tech'
  | 'experience'
  | 'profile'
  | 'storage'
  | 'auth'

export interface AdminActivity {
  id: string
  user_email: string // O el nombre del usuario
  action: ActivityAction
  resource_type: ActivityResourceType
  resource_id: string | null // ID del proyecto/tech/etc. afectado
  description: string // Un resumen de la acción (e.g., "Proyecto 'Gope Portfolio' creado")
  created_at: string
}

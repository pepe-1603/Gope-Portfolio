// src/constants/tables.ts

export const TABLES = {
  EXPERIENCE: 'work_experience',
  PROJECTS: 'projects',
  PROFILES: 'user_profiles',
  TECHS: 'techs',
} as const

// ✅ Ya no necesitas esto:
// export type TableValue = (typeof TABLES)[keyof typeof TABLES]

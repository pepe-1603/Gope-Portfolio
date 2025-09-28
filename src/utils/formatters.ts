// src/utils/formatters.ts

/**
 * Convierte un número de bytes a una cadena legible (KB, MB, GB, etc.).
 * @param bytes - El número de bytes a formatear.
 * @param decimals - Número de decimales a usar.
 * @returns La cadena formateada.
 */
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * Formatea una cadena de fecha (ISO 8601) a un formato legible localmente.
 * @param dateString - La cadena de fecha a formatear (e.g., de Supabase: '2025-09-27T10:30:00+00:00').
 * @returns La fecha y hora formateadas.
 */
export const formatDate = (dateString: string): string => {
  // Manejamos casos nulos o inválidos.
  if (!dateString) return 'Fecha desconocida'

  try {
    const date = new Date(dateString)

    // Usamos Intl.DateTimeFormat para una localización adecuada
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  } catch (error) {
    console.error('Error al formatear la fecha:', error)
    return 'Fecha inválida'
  }
}

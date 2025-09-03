// src/services/StorageService.ts

import supabase from '@/lib/supabaseClient'
import { v4 as uuidv4 } from 'uuid'

// Definimos las variables de entorno.
// Si no están definidas, usamos un valor por defecto para evitar errores.
const PROJECT_BUCKET = import.meta.env.VITE_SUPABASE_PROJECTS_BUCKET || 'projects'
const ICONS_BUCKET = import.meta.env.VITE_SUPABASE_ICONS_BUCKET || 'icons'
const AVATARS_BUCKET = import.meta.env.VITE_SUPABASE_AVATARS_BUCKET || 'avatars'

/**
 * Servicio para la gestión de archivos en Supabase Storage.
 */
export const StorageService = {
  /**
   * Sube un archivo a un bucket específico.
   * @param bucketName El nombre del bucket de destino.
   * @param file El objeto de archivo a subir.
   * @param folderPath (Opcional) La ruta de la carpeta.
   * @returns {Promise<string>} La URL pública del archivo.
   */
  uploadFile: async (
    bucketName: string,
    file: File,
    folderPath: string = ''
  ): Promise<string> => {
    try {
      const path = folderPath ? `${folderPath}/${uuidv4()}-${file.name}` : `${uuidv4()}-${file.name}`
      const { data, error } = await supabase.storage.from(bucketName).upload(path, file)

      if (error) {
        console.error('Error al subir el archivo:', error.message)
        throw new Error(`No se pudo subir el archivo: ${error.message}`)
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path)

      return publicUrlData.publicUrl
    } catch (error) {
      console.error('Error en uploadFile:', error)
      throw error
    }
  },

  /**
   * Actualiza un archivo existente.
   * @param bucketName El nombre del bucket.
   * @param oldUrl La URL del archivo a reemplazar.
   * @param newFile El nuevo objeto de archivo.
   * @param folderPath (Opcional) La ruta de la carpeta para el nuevo archivo.
   * @returns {Promise<string>} La URL pública del nuevo archivo.
   */
  updateFile: async (
    bucketName: string,
    oldUrl: string,
    newFile: File,
    folderPath: string = ''
  ): Promise<string> => {
    try {
      const path = oldUrl.split(`${bucketName}/`)[1]

      if (!path) {
        throw new Error('La URL antigua no es válida o no contiene la ruta del archivo.')
      }

      const { error: deleteError } = await supabase.storage.from(bucketName).remove([path])
      if (deleteError) {
        console.warn('Advertencia: No se pudo eliminar el archivo antiguo:', deleteError.message)
      }

      return await StorageService.uploadFile(bucketName, newFile, folderPath)
    } catch (error) {
      console.error('Error en updateFile:', error)
      throw error
    }
  },

  /**
   * Elimina un archivo de un bucket.
   * @param bucketName El nombre del bucket.
   * @param fileUrl La URL del archivo a eliminar.
   * @returns {Promise<void>}
   */
  deleteFile: async (bucketName: string, fileUrl: string): Promise<void> => {
    try {
      const path = fileUrl.split(`${bucketName}/`)[1]

      if (!path) {
        throw new Error('La URL del archivo no es válida o no contiene la ruta del archivo.')
      }

      const { error } = await supabase.storage.from(bucketName).remove([path])
      if (error) {
        console.error('Error al eliminar el archivo:', error.message)
        throw new Error(`No se pudo eliminar el archivo: ${error.message}`)
      }
    } catch (error) {
      console.error('Error en deleteFile:', error)
      throw error
    }
  },

  /**
   * Métodos públicos con los nombres de los buckets predefinidos.
   * Estos son los métodos que usarán los componentes.
   */
  // Sube un icono a su bucket específico
  uploadIcon: (file: File) => StorageService.uploadFile(ICONS_BUCKET, file, 'tech-icons'),
  // Sube una imagen de proyecto a su bucket
  uploadProjectImage: (file: File) => StorageService.uploadFile(PROJECT_BUCKET, file),

  uploadAvatarImages: (file: File) => StorageService.uploadFile(AVATARS_BUCKET, file),
  // ... puedes añadir más métodos para otros buckets (ej: avatares, PDFs, etc.)

  // Elimina una imagen de proyecto
  deleteProjectImage: (fileUrl: string) => StorageService.deleteFile(PROJECT_BUCKET, fileUrl),
}

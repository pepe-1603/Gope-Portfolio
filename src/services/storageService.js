// src/services/storageService.js

import supabase from '../utils/supabaseClient'

const IMAGES_BUCKET = 'jc-gopelabs-images' // Tu bucket de imágenes

export const storageService = {
  uploadProjectImage: async (file) => {
    const fileName = `<span class="math-inline">\{Date\.now\(\)\}\-</span>{file.name}` // Nombre único para el archivo
    const filePath = `projects/${fileName}` // Carpeta 'projects' dentro del bucket

    try {
      const { error } = await supabase.storage.from(IMAGES_BUCKET).upload(filePath, file, {
        cacheControl: '3600',
        upsert: false, // No sobrescribir si ya existe
      })

      if (error) {
        console.error('Error al subir la imagen del proyecto:', error.message)
        throw error
      }

      // Obtener la URL pública del archivo subido
      const { data: publicUrlData } = supabase.storage.from(IMAGES_BUCKET).getPublicUrl(filePath)

      if (publicUrlData) {
        return publicUrlData.publicUrl
      } else {
        throw new Error('No se pudo obtener la URL pública de la imagen.')
      }
    } catch (err) {
      console.error('Error inesperado en uploadProjectImage:', err)
      throw err
    }
  },

  // ... otras funciones para eliminar imágenes, etc.
}

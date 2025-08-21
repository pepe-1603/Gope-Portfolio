// tailwind.config.js
import defaultTheme from 'tailwindcss/defaultTheme'
import forms from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Definimos la paleta de colores
      colors: {
        // Colores principales de tu aplicación
        primary: {
          DEFAULT: '#6366f1', // Color principal (ej. para botones, enlaces)
          light: '#818cf8',
          dark: '#4f46e5',
        },
        secondary: {
          DEFAULT: '#94a3b8', // Color secundario (ej. para texto menos importante)
          light: '#e2e8f0',
          dark: '#64748b',
        },
        accent: {
          DEFAULT: '#f97316', // Un color de acento para destacar elementos
          light: '#fb923c',
          dark: '#ea580c',
        },
        // Colores para el fondo y el texto, que cambiarán con el tema
        // Usamos una paleta neutral para el fondo y el texto
        background: {
          light: '#f8fafc', // Gris muy claro para modo claro
          dark: '#111827', // Gris oscuro para modo oscuro
        },
        text: {
          light: '#1f2937', // Gris oscuro para el texto en modo claro
          dark: '#f3f4f6', // Gris claro para el texto en modo oscuro
        },
      },
      // Definimos las familias de fuentes
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans], // Para el texto principal
        mono: ['Fira Code', ...defaultTheme.fontFamily.mono], // Para el código o texto de acento
      },
    },
  },
  plugins: [
    forms({
      strategy: 'base',
    }),
  ],
}

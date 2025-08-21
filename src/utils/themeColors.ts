// src/utils/themeColors.ts

export interface ColorPaletteClasses {
  border: string
  text: string
  bg: string
  placeholder?: string
  focusShadow?: string
  contrastTextOnHover: string // Define el color del texto de contraste cuando este color es el fondo (en hover)
}

export type AvailableColorNames =
  | 'gray'
  | 'green'
  | 'blue'
  | 'yellow'
  | 'purple'
  | 'pink'
  | 'red'
  | 'indigo'

export const APP_COLORS: Record<AvailableColorNames, ColorPaletteClasses> = {
  gray: {
    border: 'border-gray-300 dark:border-gray-700',
    text: 'text-gray-900 dark:text-gray-100',
    bg: 'bg-white dark:bg-gray-800',
    placeholder: 'placeholder-gray-400 dark:placeholder-gray-500',
    focusShadow: 'focus:shadow-gray-400/50 dark:focus:shadow-gray-600/50',
    contrastTextOnHover: 'text-white dark:text-white bg-gray-600',
  },
  green: {
    border: 'border-green-400 dark:border-green-600',
    text: 'text-green-800 dark:text-green-100',
    bg: 'bg-green-50 dark:bg-green-900',
    placeholder: 'placeholder-green-300 dark:placeholder-gray-500',
    focusShadow: 'focus:shadow-green-300/50 dark:focus:shadow-green-700/50',
    contrastTextOnHover: 'text-white dark:text-white',
  },
  blue: {
    border: 'border-blue-400 dark:border-blue-600',
    text: 'text-blue-800 dark:text-blue-100',
    bg: 'bg-blue-50 dark:bg-blue-900',
    placeholder: 'placeholder-blue-300 dark:placeholder-gray-500',
    focusShadow: 'focus:shadow-blue-300/50 dark:focus:shadow-blue-700/50',
    contrastTextOnHover: 'text-white dark:text-white',
  },
  yellow: {
    border: 'border-yellow-400 dark:border-yellow-600',
    text: 'text-yellow-800 dark:text-yellow-100',
    bg: 'bg-yellow-50 dark:bg-yellow-900',
    placeholder: 'placeholder-yellow-300 dark:placeholder-gray-500',
    focusShadow: 'focus:shadow-yellow-300/50 dark:focus:shadow-yellow-700/50',
    contrastTextOnHover: 'text-gray-900 dark:text-white', // ¡Importante para el contraste!
  },
  purple: {
    border: 'border-purple-400 dark:border-purple-600',
    text: 'text-purple-800 dark:text-purple-100',
    bg: 'bg-purple-50 dark:bg-purple-900',
    placeholder: 'placeholder-purple-300 dark:placeholder-gray-500',
    focusShadow: 'focus:shadow-purple-300/50 dark:focus:shadow-purple-700/50',
    contrastTextOnHover: 'text-white dark:text-white',
  },
  pink: {
    border: 'border-pink-400 dark:border-pink-600',
    text: 'text-pink-800 dark:text-pink-100',
    bg: 'bg-pink-50 dark:bg-pink-900',
    placeholder: 'placeholder-pink-300 dark:placeholder-gray-500',
    focusShadow: 'focus:shadow-pink-300/50 dark:focus:shadow-pink-700/50',
    contrastTextOnHover: 'text-white dark:text-white',
  },
  red: {
    border: 'border-red-400 dark:border-red-600',
    text: 'text-red-800 dark:text-red-100',
    bg: 'bg-red-50 dark:bg-red-900',
    placeholder: 'placeholder-red-300 dark:placeholder-gray-500',
    focusShadow: 'focus:shadow-red-300/50 dark:focus:shadow-red-700/50',
    contrastTextOnHover: 'text-white dark:text-white',
  },
  indigo: {
    border: 'border-indigo-400 dark:border-indigo-600',
    text: 'text-indigo-800 dark:text-indigo-100',
    bg: 'bg-indigo-50 dark:bg-indigo-900',
    placeholder: 'placeholder-indigo-300 dark:placeholder-gray-500',
    focusShadow: 'focus:shadow-indigo-300/50 dark:focus:shadow-indigo-700/50',
    contrastTextOnHover: 'text-white dark:text-white',
  },
}

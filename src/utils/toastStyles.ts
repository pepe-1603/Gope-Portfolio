import { cva, type VariantProps } from 'class-variance-authority'

export const toastStyles = cva(
  // Clases base para el toast
  'w-fit rounded-md p-4 text-sm font-medium shadow-md flex items-center transition-all duration-400 bg-gray-50 dark:bg-gray-700 border-2',
  {
    variants: {
      // Definimos los tipos de toast (intent).
      intent: {
        // Tema Claro
        success: 'border-green-600 text-green-600',
        error: 'border-red-600 text-red-600',
        info: 'border-blue-600 text-blue-600',
        warning: 'border-yellow-500 text-yellow-500',
        default: 'border-gray-700 text-gray-700',
        upcoming: 'border-cyan-500 text-cyan-500', // ✅ Nuevo intent para 'novedades y new feature'
        'new-feature': 'border-purple-600 text-purple-600',
      },
    },
    // El valor predeterminado si no se pasa `intent`
    defaultVariants: {
      intent: 'default',
    },
    compoundVariants: [
      // Estilos para el TEMA OSCURO
      {
        intent: ['success', 'error', 'info', 'warning', 'default', 'upcoming', 'new-feature'], // ✅ Añadido 'upcoming y new-feature'
        class: 'dark:bg-gray-800 dark:border-gray-700',
      },
      // Estilos específicos para cada tipo en TEMA OSCURO
      {
        intent: 'success',
        class: 'dark:border-green-400 dark:text-green-400',
      },
      {
        intent: 'error',
        class: 'dark:border-red-400 dark:text-red-400',
      },
      {
        intent: 'info',
        class: 'dark:border-blue-400 dark:text-blue-400',
      },
      {
        intent: 'warning',
        class: 'dark:border-yellow-400 dark:text-yellow-400',
      },
      {
        intent: 'default',
        class: 'dark:border-gray-400 dark:text-gray-400',
      },
      // ✅ Estilos para  nuevos intent
      {
        intent: 'upcoming',
        class: 'dark:border-cyan-400 dark:text-cyan-400',
      },
      {
        intent: 'new-feature',
        class: 'dark:border-purple-400 dark:text-purple-400',
      },
    ],
  },
)

export type ToastVariants = VariantProps<typeof toastStyles>

import { cva, type VariantProps } from 'class-variance-authority'

export const alertTextStyles = cva('p-2 w-full rounded relative', {
  variants: {
    intent: {
      info: 'text-blue-500 dark:text-blue-400',
      success: 'text-green-500 dark:text-green-400',
      warning: 'text-yellow-500 dark:text-yellow-400',
      danger: 'text-red-500 dark:text-red-400',
      upcoming: 'text-indigo-500 dark:text-indigo-400',
      'new-feature': 'text-purple-500 dark:text-purple-400',
      // ✅ NUEVO: Intent por defecto de color gris/neutral
      default: 'text-gray-700 dark:text-gray-300',
    },
  },
})

export const alertBarStyles = cva('w-1 h-full absolute left-0 top-0 rounded-l', {
  variants: {
    intent: {
      info: 'bg-blue-500 dark:bg-blue-400',
      success: 'bg-green-500 dark:bg-green-400',
      warning: 'bg-yellow-500 dark:bg-yellow-400',
      danger: 'bg-red-500 dark:bg-red-400',
      upcoming: 'bg-indigo-500 dark:bg-indigo-400',
      'new-feature': 'bg-purple-500 dark:bg-purple-400',
      // ✅ NUEVO: Barra gris por defecto
      default: 'bg-gray-400 dark:bg-gray-500',
    },
  },
  defaultVariants: {
    intent: 'default',
  },
})

export const alertDismissButtonStyles = cva(
  // Clases base que ya tenías: color de texto genérico y focus
  'text-gray-500 dark:text-gray-400 focus:ring-gray-500 rounded-full p-1 transition-colors duration-200',
  {
    variants: {
      intent: {
        // ✅ CORRECCIÓN: Ahora el fondo del hover usa un tono claro del intent
        info: 'hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50',
        success:
          'hover:text-green-700 dark:hover:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50',
        warning:
          'hover:text-yellow-700 dark:hover:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/50',
        danger:
          'hover:text-red-700 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50',
        upcoming:
          'hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50',
        'new-feature':
          'hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50',
        // ✅ NUEVO: Estilo de hover gris por defecto
        default:
          'hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50',
      },
    },
    defaultVariants: {
      intent: 'default',
    },
  },
)

export type AlertVariants = VariantProps<typeof alertTextStyles>
export type AlertBarVariants = VariantProps<typeof alertBarStyles>
export type AlertDismissButtonVariants = VariantProps<typeof alertDismissButtonStyles>

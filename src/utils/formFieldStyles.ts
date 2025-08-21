import { cva, type VariantProps } from 'class-variance-authority'

export const formFieldStyles = cva(
  // Clases base que se aplican a todos los inputs.
  // Usamos `w-full` para que ocupe todo el espacio.
  'w-full rounded-md border text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 px-3 py-2',
  {
    variants: {
      intent: {
        // Estado por defecto
        default:
          'border-gray-300 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-600',
        // Estado de éxito
        success:
          'border-green-500 focus:ring-green-300 dark:border-green-700 dark:bg-gray-800 dark:text-white dark:focus:ring-green-600',
        // Estado de error
        error:
          'border-red-500 focus:ring-red-300 dark:border-red-700 dark:bg-gray-800 dark:text-white dark:focus:ring-red-600',
        // Estado deshabilitado
        disabled: 'bg-gray-100 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400',
      },
    },
    defaultVariants: {
      intent: 'default',
    },
  },
)

export type FormFieldVariants = VariantProps<typeof formFieldStyles>

import { cva, type VariantProps } from 'class-variance-authority'

export const buttonStyles = cva(
  // Clases base.
  // Movemos `focus:ring-offset-2` para poder personalizarlo por variante.
  'font-semibold rounded transition duration-300 w-fit focus:outline-none focus:ring-2 box-shadow-none',
  {
    variants: {
      intent: {
        // Primary (Indigo)
        primary:
          'bg-transparent hover:bg-indigo-500 text-indigo-700 hover:text-white border border-indigo-500 hover:border-transparent focus:ring-indigo-300 focus:ring-offset-indigo-500 dark:text-indigo-300 dark:border-indigo-500 dark:hover:bg-indigo-500 dark:hover:text-white dark:focus:ring-indigo-300 dark:focus:ring-offset-gray-900',
        // Secondary (Gray)
        secondary:
          'bg-transparent hover:bg-gray-500 text-gray-700 hover:text-white border border-gray-500 hover:border-transparent focus:ring-gray-300 focus:ring-offset-gray-500 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-500 dark:hover:text-white dark:focus:ring-gray-300 dark:focus:ring-offset-gray-900',
        // Warning (Orange)
        warning:
          'bg-transparent hover:bg-orange-500 text-orange-700 hover:text-white border border-orange-500 hover:border-transparent focus:ring-orange-300 focus:ring-offset-orange-500 dark:text-orange-300 dark:border-orange-500 dark:hover:bg-orange-500 dark:hover:text-white dark:focus:ring-orange-300 dark:focus:ring-offset-gray-900',
        // Purple Power
        'purple-power':
          'bg-transparent hover:bg-purple-500 text-purple-700 hover:text-white border border-purple-500 hover:border-transparent focus:ring-purple-300 focus:ring-offset-purple-500 dark:text-purple-300 dark:border-purple-500 dark:hover:bg-purple-500 dark:hover:text-white dark:focus:ring-purple-300 dark:focus:ring-offset-gray-900',
        // Info (Blue)
        info: 'bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white border border-blue-500 hover:border-transparent focus:ring-blue-300 focus:ring-offset-blue-500 dark:text-blue-300 dark:border-blue-500 dark:hover:bg-blue-500 dark:hover:text-white dark:focus:ring-blue-300 dark:focus:ring-offset-gray-900',
        // Ghost - Ajustado para que el ring-offset sea del mismo color que el hover.
        ghost:
          'bg-transparent hover:bg-gray-100 text-gray-700 border border-transparent focus:ring-gray-300 focus:ring-offset-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:ring-gray-600 dark:focus:ring-offset-gray-900',
        // Link - Sin borde ni fondo, con un texto tipo enlace.
        link: 'bg-transparent text-blue-600 border-none hover:underline focus:ring-blue-300 focus:ring-offset-white dark:text-blue-400 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-900',
        // Danger
        danger:
          'bg-transparent hover:bg-red-500 text-red-700 hover:text-white border border-red-500 hover:border-transparent focus:ring-red-300 focus:ring-offset-red-500 dark:text-red-300 dark:border-red-500 dark:hover:bg-red-500 dark:hover:text-white dark:focus:ring-red-300 dark:focus:ring-offset-gray-900',
      },
      size: {
        sm: 'text-sm py-1 px-2',
        md: 'text-base py-2 px-4',
        lg: 'text-lg py-3 px-6',
      },
      fullWidth: {
        true: '!w-full',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
      },
    },
    defaultVariants: {
      intent: 'info',
      size: 'md',
      fullWidth: false,
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonStyles>

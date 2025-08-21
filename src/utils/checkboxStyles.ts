import { cva, type VariantProps } from 'class-variance-authority'

export const checkboxStyles = cva(
  'h-4 w-4 rounded border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900',
  {
    variants: {
      intent: {
        default:
          'border-gray-300 text-blue-600 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-800 dark:checked:bg-blue-600',
        success:
          'border-green-500 text-green-600 focus:ring-green-300 dark:border-green-700 dark:checked:bg-green-600',
        error:
          'border-red-500 text-red-600 focus:ring-red-300 dark:border-red-700 dark:checked:bg-red-600',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
      },
    },
    defaultVariants: {
      intent: 'default',
      disabled: false,
    },
  },
)

export type CheckboxVariants = VariantProps<typeof checkboxStyles>

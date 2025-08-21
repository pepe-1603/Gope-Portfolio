import { cva, type VariantProps } from 'class-variance-authority'

export const alertStyles = cva(
  // Clases base actualizadas
  'relative w-full rounded-sm p-4 text-sm font-medium flex items-center border-l-4',
  {
    variants: {
      intent: {
        info: '',
        success: '',
        warning: '',
        danger: '',
      },
      variant: {
        default: '',
        outline: 'outline outline-1',
      },
    },
    compoundVariants: [
      {
        intent: 'info',
        variant: 'default',
        class: 'border-blue-800 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
      },
      {
        intent: 'info',
        variant: 'outline',
        class:
          'border-blue-600 outline-blue-400 text-blue-800 dark:outline-blue-700 dark:text-blue-300',
      },
      {
        intent: 'success',
        variant: 'default',
        class: 'border-green-800 bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300',
      },
      {
        intent: 'success',
        variant: 'outline',
        class:
          'border-green-600 outline-green-400 text-green-800 dark:outline-green-700 dark:text-green-300',
      },
      {
        intent: 'warning',
        variant: 'default',
        class:
          'border-yellow-800 bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
      },
      {
        intent: 'warning',
        variant: 'outline',
        class:
          'border-yellow-600 outline-yellow-400 text-yellow-800 dark:outline-yellow-700 dark:text-yellow-300',
      },
      {
        intent: 'danger',
        variant: 'default',
        class: 'border-red-800 bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
      },
      {
        intent: 'danger',
        variant: 'outline',
        class: 'border-red-600 outline-red-400 text-red-800 dark:outline-red-700 dark:text-red-300',
      },
    ],
    defaultVariants: {
      intent: 'info',
      variant: 'default',
    },
  },
)

export type AlertVariants = VariantProps<typeof alertStyles>

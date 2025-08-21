import { cva, type VariantProps } from 'class-variance-authority'

export const switchStyles = cva(
  // Clases base para el "rizo" o "thumb" del switch
  'h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ease-in-out',
  {
    variants: {
      checked: {
        true: 'translate-x-full',
        false: 'translate-x-0',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: '',
      },
    },
    defaultVariants: {
      checked: false,
      disabled: false,
    },
  },
)

export const switchTrackStyles = cva(
  // Clases base para el "track" o "pista" del switch
  'relative inline-block h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
  {
    variants: {
      checked: {
        true: 'bg-blue-600 dark:bg-blue-500',
        false: 'bg-gray-200 dark:bg-gray-700',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: '',
      },
    },
    defaultVariants: {
      checked: false,
      disabled: false,
    },
  },
)

export type SwitchVariants = VariantProps<typeof switchStyles>

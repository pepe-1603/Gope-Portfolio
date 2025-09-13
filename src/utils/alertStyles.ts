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
    },
  },
  defaultVariants: {
    intent: 'info',
  },
})

export const alertDismissButtonStyles = cva(
  'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-gray-500',
  {
    variants: {
      intent: {
        info: 'hover:text-blue-700 dark:hover:text-blue-300',
        success: 'hover:text-green-700 dark:hover:text-green-300',
        warning: 'hover:text-yellow-700 dark:hover:text-yellow-300',
        danger: 'hover:text-red-700 dark:hover:text-red-300',
        upcoming: 'hover:text-indigo-700 dark:hover:text-indigo-300',
        'new-feature': 'hover:text-purple-700 dark:hover:text-purple-300',
      },
    },
    defaultVariants: {
      intent: 'info',
    },
  },
)

export type AlertVariants = VariantProps<typeof alertTextStyles>
export type AlertBarVariants = VariantProps<typeof alertBarStyles>
export type AlertDismissButtonVariants = VariantProps<typeof alertDismissButtonStyles>

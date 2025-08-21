import { cva, type VariantProps } from 'class-variance-authority'

export const badgeStyles = cva(
  'inline-flex items-center rounded-md font-medium ring-1 ring-inset',
  {
    variants: {
      color: {
        gray: 'text-gray-700 bg-gray-50 ring-gray-600/10 dark:text-gray-200 dark:bg-gray-700 dark:ring-gray-300/10',
        red: 'text-red-700 bg-red-50 ring-red-600/10 dark:text-red-300 dark:bg-red-900/20 dark:ring-red-500/20',
        yellow:
          'text-yellow-700 bg-yellow-50 ring-yellow-600/10 dark:text-yellow-300 dark:bg-yellow-900/20 dark:ring-yellow-500/20',
        green:
          'text-green-700 bg-green-50 ring-green-600/10 dark:text-green-300 dark:bg-green-900/20 dark:ring-green-500/20',
        blue: 'text-blue-700 bg-blue-50 ring-blue-600/10 dark:text-blue-300 dark:bg-blue-900/20 dark:ring-blue-500/20',
        indigo:
          'text-indigo-700 bg-indigo-50 ring-indigo-600/10 dark:text-indigo-300 dark:bg-indigo-900/20 dark:ring-indigo-500/20',
        purple:
          'text-purple-700 bg-purple-50 ring-purple-600/10 dark:text-purple-300 dark:bg-purple-900/20 dark:ring-purple-500/20',
        pink: 'text-pink-700 bg-pink-50 ring-pink-600/10 dark:text-pink-300 dark:bg-pink-900/20 dark:ring-pink-500/20',
      },
      size: {
        xs: 'px-1.5 py-0.5 text-xs',
        sm: 'px-2 py-1 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base',
        xl: 'px-4 py-2 text-lg',
      },
    },
    defaultVariants: {
      color: 'gray',
      size: 'sm',
    },
  },
)

export type BadgeVariants = VariantProps<typeof badgeStyles>

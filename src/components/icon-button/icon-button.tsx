import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { buttonVariants } from '../button/button'

const iconButtonSizeVariants = cva('inline-flex shrink-0 items-center justify-center', {
  variants: {
    size: {
      sm: 'h-9 w-9',
      default: 'h-10 w-10',
      lg: 'h-11 w-11',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'>,
    Pick<VariantProps<typeof buttonVariants>, 'variant'>,
    VariantProps<typeof iconButtonSizeVariants> {
  icon: React.ReactNode
  /** Required — an icon-only button has no visible text, so an accessible name must be supplied explicitly. */
  'aria-label': string
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, icon, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        buttonVariants({ variant }),
        iconButtonSizeVariants({ size }),
        'p-0',
        className
      )}
      {...props}
    >
      {icon}
    </button>
  )
)
IconButton.displayName = 'IconButton'

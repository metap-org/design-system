import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

// Badge = static status indicator (rounded-md, no interaction). Distinct from Chip
// (rounded-full, optionally removable via onClose) and Tag (category-color label via a
// `color` prop rather than semantic variant) — see docs/component-status.md for the split.
export const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-sm py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
        outline: 'border-border bg-background text-foreground',
        success: 'border-transparent bg-emerald-600 text-white',
        warning: 'border-transparent bg-amber-500 text-white',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
  )
)
Badge.displayName = 'Badge'

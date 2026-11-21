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
        success: 'border-transparent bg-success text-success-foreground',
        warning: 'border-transparent bg-warning text-warning-foreground',
        info: 'border-transparent bg-info text-info-foreground',
        // Quiet counterparts: tinted fill and colored text on the page background, for dense
        // tables where a column of solid badges would shout. Same meaning as the solid ones.
        'success-soft': 'border-success/30 bg-success/10 text-success',
        // Amber text on a light page is unreadable, so the quiet warning keeps the ink color.
        'warning-soft': 'border-warning/50 bg-warning/15 text-warning-foreground',
        'destructive-soft': 'border-destructive/30 bg-destructive/10 text-destructive',
        'info-soft': 'border-info/30 bg-info/10 text-info',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
  )
)
Badge.displayName = 'Badge'

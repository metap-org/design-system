import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

// Tag = static categorization label keyed by an arbitrary `color` (not a semantic
// variant like Badge's default/destructive/success/...). Use Tag for free-form
// category/keyword labels (product category, document tag) where the color itself
// carries no status meaning; use Badge when the color communicates a status.
export const tagVariants = cva(
  'inline-flex items-center rounded-md border px-sm py-0.5 text-xs font-medium',
  {
    variants: {
      color: {
        gray: 'border-transparent bg-muted text-muted-foreground',
        blue: 'border-info/20 bg-info/10 text-info',
        green: 'border-success/20 bg-success/10 text-success',
        yellow: 'border-warning/40 bg-warning/15 text-warning-foreground',
        red: 'border-destructive/20 bg-destructive/10 text-destructive',
        purple: 'border-chart-2/20 bg-chart-2/10 text-chart-2',
      },
    },
    defaultVariants: { color: 'gray' },
  }
)

export interface TagProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>, VariantProps<typeof tagVariants> {
  label: string
}

export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ className, color, label, ...props }, ref) => (
    <span ref={ref} className={cn(tagVariants({ color }), className)} {...props}>
      {label}
    </span>
  )
)
Tag.displayName = 'Tag'

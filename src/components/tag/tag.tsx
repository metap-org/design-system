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
        blue: 'border-transparent bg-blue-100 text-blue-800',
        green: 'border-transparent bg-green-100 text-green-800',
        yellow: 'border-transparent bg-yellow-100 text-yellow-800',
        red: 'border-transparent bg-red-100 text-red-800',
        purple: 'border-transparent bg-purple-100 text-purple-800',
      },
    },
    defaultVariants: { color: 'gray' },
  }
)

export interface TagProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>,
    VariantProps<typeof tagVariants> {
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

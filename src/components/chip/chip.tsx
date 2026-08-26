import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

export const chipVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-sm py-0.5 text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
        outline: 'border-border bg-background text-foreground',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface ChipProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof chipVariants> {
  label: string
  onClose?: () => void
}

export const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(
  ({ className, variant, label, onClose, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(chipVariants({ variant }), className)}
      {...props}
    >
      {label}
      {onClose && (
        <button
          type="button"
          onClick={e => { e.stopPropagation(); onClose?.() }}
          className="ml-0.5 inline-flex items-center justify-center rounded-full p-0.5 opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          aria-label={`Remove ${label}`}
        >
          <svg
            className="h-3 w-3"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M2 2l8 8M10 2l-8 8" />
          </svg>
        </button>
      )}
    </span>
  )
)
Chip.displayName = 'Chip'

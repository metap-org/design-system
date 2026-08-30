import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const spinnerVariants = cva('animate-spin text-muted-foreground', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      default: 'h-6 w-6',
      lg: 'h-8 w-8',
    },
  },
  defaultVariants: { size: 'default' },
})

export interface SpinnerProps
  extends React.SVGAttributes<SVGSVGElement>,
    VariantProps<typeof spinnerVariants> {
  /** Text announced to screen readers while loading — defaults to Vietnamese "Đang tải...". */
  label?: string
}

export const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, size, label = 'Đang tải...', ...props }, ref) => (
    <span role="status">
      <svg
        ref={ref}
        className={cn(spinnerVariants({ size }), className)}
        viewBox="0 0 24 24"
        fill="none"
        {...props}
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  )
)
Spinner.displayName = 'Spinner'

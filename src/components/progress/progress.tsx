import * as React from 'react'
import { cn } from '../../lib/utils'

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, ...props }, ref) => {
    const clamped = Math.min(max, Math.max(0, value))
    const percent = max === 0 ? 0 : (clamped / max) * 100

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cn('h-2 w-full overflow-hidden rounded-full bg-muted', className)}
        {...props}
      >
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    )
  }
)
Progress.displayName = 'Progress'

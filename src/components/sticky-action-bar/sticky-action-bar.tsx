import * as React from 'react'
import { cn } from '../../lib/utils'

/**
 * Save / discard for a form with unsaved changes, stuck to the bottom of the scrolling area so
 * it stays in reach on a long settings page. Renders nothing while `visible` is false.
 */
export interface StickyActionBarProps extends React.HTMLAttributes<HTMLDivElement> {
  visible: boolean
  /** Left side, e.g. "2 unsaved changes". */
  message?: React.ReactNode
}

export const StickyActionBar = React.forwardRef<HTMLDivElement, StickyActionBarProps>(
  ({ visible, message, children, className, ...props }, ref) => {
    if (!visible) return null
    return (
      <div
        ref={ref}
        role="region"
        className={cn(
          'sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-background/95 px-4 py-2 shadow-md backdrop-blur',
          className
        )}
        {...props}
      >
        <span className="text-sm text-muted-foreground">{message}</span>
        <div className="flex items-center gap-2">{children}</div>
      </div>
    )
  }
)
StickyActionBar.displayName = 'StickyActionBar'

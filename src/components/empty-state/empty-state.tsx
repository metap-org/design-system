import * as React from 'react'
import { cn } from '../../lib/utils'

/**
 * Dashed-border "nothing here yet" placeholder — title + optional description + optional action
 * (e.g. a "Create" button). Generic on purpose, moved here from `metap-demo-waf/data-plane/web`
 * (2026-09-05, `docs/features/26-waf-primitives-to-design-system.md`) — found domain-free and
 * repeated across 10 pages there. `platform-ui`'s own `GeneratedList` currently renders its empty
 * state as a bare table-cell string; it can adopt this too, not just WAF.
 */
export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  action?: React.ReactNode
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ title, description, action, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-lg border border-dashed p-10 text-center', className)}
      {...props}
    >
      <p className="font-medium">{title}</p>
      {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  )
)
EmptyState.displayName = 'EmptyState'

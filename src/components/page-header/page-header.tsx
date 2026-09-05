import * as React from 'react'
import { cn } from '../../lib/utils'

/**
 * Page-level title + optional description + right-aligned action slot — the layout shape a
 * screen's own header needs, wherever an app doesn't want to hand-roll it per page. Generic on
 * purpose: nothing here knows about any entity or business domain, only `title`/`description`/
 * `actions`. Moved here from `metap-demo-waf/data-plane/web` (2026-09-05,
 * `docs/features/26-waf-primitives-to-design-system.md`) — found domain-free and repeated across
 * 10 pages there, the same architecture gap `BarChart`'s own move here already documents.
 */
export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  actions?: React.ReactNode
}

export const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ title, description, actions, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mb-6 flex flex-wrap items-start justify-between gap-3', className)}
      {...props}
    >
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
)
PageHeader.displayName = 'PageHeader'

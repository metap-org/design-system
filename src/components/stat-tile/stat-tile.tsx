import * as React from 'react'
import { Card, CardContent } from '../card'
import { Skeleton } from '../skeleton'
import { cn } from '../../lib/utils'

/**
 * A single labeled stat — label + big value + optional hint, with a `tone` for
 * danger/warning/success coloring and a loading skeleton. Generic on purpose, moved here from
 * `metap-demo-waf/data-plane/web` (2026-09-05, `docs/features/26-waf-primitives-to-design-system.md`)
 * — found domain-free (no field ever carries a business value) and repeated across 4 pages there.
 */
export interface StatTileProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: React.ReactNode
  hint?: string
  tone?: 'default' | 'danger' | 'warning' | 'success'
  loading?: boolean
}

export const StatTile = React.forwardRef<HTMLDivElement, StatTileProps>(
  ({ label, value, hint, tone = 'default', loading, className, ...props }, ref) => {
    const toneClass =
      tone === 'danger'
        ? 'text-destructive'
        : tone === 'warning'
          ? 'text-amber-600 dark:text-amber-500'
          : tone === 'success'
            ? 'text-emerald-600 dark:text-emerald-500'
            : ''
    return (
      <Card ref={ref} className={className} {...props}>
        <CardContent className="p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </div>
          {loading ? (
            <Skeleton className="mt-2 h-8 w-16" />
          ) : (
            <div className={cn('mt-1 text-2xl font-semibold tabular-nums', toneClass)}>
              {value}
            </div>
          )}
          {hint ? <div className="mt-1 text-xs text-muted-foreground">{hint}</div> : null}
        </CardContent>
      </Card>
    )
  }
)
StatTile.displayName = 'StatTile'

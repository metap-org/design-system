import * as React from 'react'
import { Card, CardContent } from '../card'

/**
 * A `Card` with a title/description/actions header row above `children` — the layout shape most
 * "one block of content on a page" sections need. Generic on purpose, moved here from
 * `metap-demo-waf/data-plane/web` (2026-09-05, `docs/features/26-waf-primitives-to-design-system.md`)
 * — found domain-free and repeated across 12 pages there.
 */
export interface SectionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  actions?: React.ReactNode
  children: React.ReactNode
}

export const SectionCard = React.forwardRef<HTMLDivElement, SectionCardProps>(
  ({ title, description, actions, children, className, ...props }, ref) => (
    <Card ref={ref} className={className} {...props}>
      <CardContent className="p-4">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold">{title}</h2>
            {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
          </div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </div>
        {children}
      </CardContent>
    </Card>
  )
)
SectionCard.displayName = 'SectionCard'

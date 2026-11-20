import * as React from 'react'
import { cn } from '../../lib/utils'

/**
 * A group of settings: a heading over rows divided by rules, full width, no nested card padding.
 * Each `SettingsRow` puts its label and help text on the left and its control on the right
 * (stacked on narrow screens), so a settings page reads as one scannable column of decisions
 * instead of a stack of cards.
 */
export interface SettingsSectionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title: React.ReactNode
  description?: React.ReactNode
  /** Controls on the heading's right (a status badge, a "New" button). */
  actions?: React.ReactNode
}

export const SettingsSection = React.forwardRef<HTMLElement, SettingsSectionProps>(
  ({ title, description, actions, children, className, ...props }, ref) => (
    <section ref={ref} className={cn('rounded-lg border border-border bg-card', className)} {...props}>
      <header className="flex flex-wrap items-start justify-between gap-2 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          {description ? <p className="mt-0.5 text-xs text-muted-foreground">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </header>
      <div className="divide-y divide-border">{children}</div>
    </section>
  )
)
SettingsSection.displayName = 'SettingsSection'

export interface SettingsRowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  label: React.ReactNode
  description?: React.ReactNode
  /** The control's id, so clicking the label focuses it. */
  htmlFor?: string
  /** Under the label, e.g. "Default" or a "Reset" link. */
  meta?: React.ReactNode
  /** `wide` gives the control most of the row (a long URL, a tag list); its first child
   *  stretches to fill it. */
  controlWidth?: 'auto' | 'wide'
}

export const SettingsRow = React.forwardRef<HTMLDivElement, SettingsRowProps>(
  ({ label, description, htmlFor, meta, controlWidth = 'auto', children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'grid gap-2 px-4 py-3 md:items-center md:gap-6',
        controlWidth === 'wide'
          ? 'md:grid-cols-[minmax(12rem,1fr)_minmax(0,2fr)]'
          : 'md:grid-cols-[minmax(0,1fr)_auto]',
        className
      )}
      {...props}
    >
      <div className="min-w-0">
        <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
          {label}
        </label>
        {description ? <p className="mt-0.5 text-xs text-muted-foreground">{description}</p> : null}
        {meta ? <div className="mt-1 text-xs">{meta}</div> : null}
      </div>
      <div
        className={cn(
          'flex min-w-0 items-center gap-2',
          // Wide: the first control (an input, a picker) takes the row's width; buttons after it
          // keep theirs. Inputs carry their own wrapper, so the child itself is what grows.
          controlWidth === 'wide' ? 'w-full [&>:first-child]:min-w-0 [&>:first-child]:flex-1' : 'md:justify-end'
        )}
      >
        {children}
      </div>
    </div>
  )
)
SettingsRow.displayName = 'SettingsRow'

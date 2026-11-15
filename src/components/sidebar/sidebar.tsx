import * as React from 'react'
import { Slot, Slottable } from '@radix-ui/react-slot'
import { cn } from '../../lib/utils'

/**
 * Left-hand app navigation: a vertical rail of grouped links that can collapse to icons, the
 * dashboard layout (Cloudflare-style) where a top bar would run out of width once a product has
 * more than a handful of sections. Purely presentational: it knows nothing about routing (an
 * item is a link only through `asChild`) or about who may see what — the consumer decides which
 * items render and which one is `active`.
 *
 * Collapsed state flows from `Sidebar` to every item and group through context, so a consumer
 * toggles one prop instead of threading it through each child.
 */
const SidebarContext = React.createContext<{ collapsed: boolean }>({ collapsed: false })

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  /** Icon-only rail: labels become screen-reader-only and each item shows its icon (or initials). */
  collapsed?: boolean
}

export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ collapsed = false, className, ...props }, ref) => (
    <SidebarContext.Provider value={{ collapsed }}>
      <aside
        ref={ref}
        data-collapsed={collapsed || undefined}
        className={cn(
          'flex h-full shrink-0 flex-col border-r border-border bg-muted/30 transition-[width] duration-200',
          collapsed ? 'w-14' : 'w-60',
          className
        )}
        {...props}
      />
    </SidebarContext.Provider>
  )
)
Sidebar.displayName = 'Sidebar'

export const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex h-12 shrink-0 items-center gap-2 border-b border-border px-xs',
        className
      )}
      {...props}
    />
  )
)
SidebarHeader.displayName = 'SidebarHeader'

export const SidebarContent = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn('flex min-h-0 flex-1 flex-col gap-sm overflow-y-auto px-xs py-sm', className)}
      {...props}
    />
  )
)
SidebarContent.displayName = 'SidebarContent'

export const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex shrink-0 flex-col gap-1 border-t border-border p-xs', className)}
      {...props}
    />
  )
)
SidebarFooter.displayName = 'SidebarFooter'

export interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Section heading; hidden (kept for screen readers) while collapsed, where a divider stands in. */
  label?: string
}

export const SidebarGroup = React.forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ label, className, children, ...props }, ref) => {
    const { collapsed } = React.useContext(SidebarContext)
    return (
      <div
        ref={ref}
        role="group"
        aria-label={label}
        className={cn('flex flex-col gap-0.5', className)}
        {...props}
      >
        {label ? (
          collapsed ? (
            <div aria-hidden className="mx-2 my-1 border-t border-border" />
          ) : (
            <div className="px-2 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {label}
            </div>
          )
        ) : null}
        {children}
      </div>
    )
  }
)
SidebarGroup.displayName = 'SidebarGroup'

export interface SidebarItemProps extends React.HTMLAttributes<HTMLElement> {
  label: string
  icon?: React.ReactNode
  active?: boolean
  /** Render the single child (a router link) as the item, so routing stays the consumer's. */
  asChild?: boolean
}

function initials(label: string): string {
  const words = label.trim().split(/\s+/)
  return (words.length > 1 ? words[0][0] + words[1][0] : label.slice(0, 2)).toUpperCase()
}

/**
 * One navigation entry. With `asChild`, pass the link as the only child and leave it empty:
 * `<SidebarItem asChild label="Zones" icon={…}><Link to="/zones" /></SidebarItem>` renders the
 * link with the icon and label inside it.
 */
export const SidebarItem = React.forwardRef<HTMLElement, SidebarItemProps>(
  ({ label, icon, active = false, asChild = false, className, children, ...props }, ref) => {
    const { collapsed } = React.useContext(SidebarContext)
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref as React.Ref<HTMLButtonElement>}
        aria-current={active ? 'page' : undefined}
        title={collapsed ? label : undefined}
        data-active={active || undefined}
        className={cn(
          'flex h-8 w-full items-center gap-2 rounded-md px-2 text-sm transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          active
            ? 'bg-accent font-medium text-accent-foreground'
            : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
          collapsed && 'justify-center px-0',
          className
        )}
        {...props}
      >
        {icon ? (
          <span
            aria-hidden
            className="flex h-4 w-4 shrink-0 items-center justify-center [&>svg]:h-4 [&>svg]:w-4"
          >
            {icon}
          </span>
        ) : collapsed ? (
          <span aria-hidden className="text-[11px] font-semibold">
            {initials(label)}
          </span>
        ) : null}
        <span className={collapsed ? 'sr-only' : 'truncate'}>{label}</span>
        <Slottable>{children}</Slottable>
      </Comp>
    )
  }
)
SidebarItem.displayName = 'SidebarItem'

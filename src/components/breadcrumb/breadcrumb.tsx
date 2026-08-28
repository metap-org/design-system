import * as React from 'react'
import { cn } from '../../lib/utils'

export type BreadcrumbProps = React.ComponentPropsWithoutRef<'nav'>

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>((props, ref) => (
  <nav ref={ref} aria-label="breadcrumb" {...props} />
))
Breadcrumb.displayName = 'Breadcrumb'

export type BreadcrumbListProps = React.ComponentPropsWithoutRef<'ol'>

export const BreadcrumbList = React.forwardRef<HTMLOListElement, BreadcrumbListProps>(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn(
        'flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground sm:gap-2.5',
        className
      )}
      {...props}
    />
  )
)
BreadcrumbList.displayName = 'BreadcrumbList'

export type BreadcrumbItemProps = React.ComponentPropsWithoutRef<'li'>

export const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn('inline-flex items-center gap-1.5', className)} {...props} />
  )
)
BreadcrumbItem.displayName = 'BreadcrumbItem'

export type BreadcrumbLinkProps = React.ComponentPropsWithoutRef<'a'>

export const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ className, ...props }, ref) => (
    <a ref={ref} className={cn('transition-colors hover:text-foreground', className)} {...props} />
  )
)
BreadcrumbLink.displayName = 'BreadcrumbLink'

export type BreadcrumbPageProps = React.ComponentPropsWithoutRef<'span'>

export const BreadcrumbPage = React.forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn('font-medium text-foreground', className)}
      {...props}
    />
  )
)
BreadcrumbPage.displayName = 'BreadcrumbPage'

export type BreadcrumbSeparatorProps = React.ComponentPropsWithoutRef<'li'>

export const BreadcrumbSeparator = ({ children, className, ...props }: BreadcrumbSeparatorProps) => (
  <li role="presentation" aria-hidden="true" className={cn('[&>svg]:h-3.5 [&>svg]:w-3.5', className)} {...props}>
    {children ?? (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m9 18 6-6-6-6" />
      </svg>
    )}
  </li>
)
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator'

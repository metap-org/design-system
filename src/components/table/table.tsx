import * as React from 'react'
import { cn } from '../../lib/utils'

export type TableProps = React.TableHTMLAttributes<HTMLTableElement>

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => (
    <div className="w-full overflow-x-auto">
      <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  )
)
Table.displayName = 'Table'

export type TableHeaderProps = React.HTMLAttributes<HTMLTableSectionElement>

export const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn('[&_tr]:border-b [&_tr]:border-border', className)} {...props} />
  )
)
TableHeader.displayName = 'TableHeader'

export type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement>

export const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
  )
)
TableBody.displayName = 'TableBody'

export type TableFooterProps = React.HTMLAttributes<HTMLTableSectionElement>

export const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn('border-t border-border bg-muted/50 font-medium', className)}
      {...props}
    />
  )
)
TableFooter.displayName = 'TableFooter'

export type TableRowProps = React.HTMLAttributes<HTMLTableRowElement>

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
        className
      )}
      {...props}
    />
  )
)
TableRow.displayName = 'TableRow'

export type TableHeadProps = React.ThHTMLAttributes<HTMLTableCellElement>

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'h-10 px-md text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    />
  )
)
TableHead.displayName = 'TableHead'

export type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement>

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn('p-md align-middle [&:has([role=checkbox])]:pr-0', className)}
      {...props}
    />
  )
)
TableCell.displayName = 'TableCell'

export type TableCaptionProps = React.HTMLAttributes<HTMLTableCaptionElement>

export const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={cn('mt-md text-sm text-muted-foreground', className)} {...props} />
  )
)
TableCaption.displayName = 'TableCaption'

import * as React from 'react'
import { cn } from '../../lib/utils'

function getPageList(page: number, totalPages: number, siblingCount: number): (number | 'ellipsis')[] {
  const totalSlots = siblingCount * 2 + 5 // first + last + current + 2 possible ellipses
  if (totalSlots >= totalPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const leftSibling = Math.max(page - siblingCount, 1)
  const rightSibling = Math.min(page + siblingCount, totalPages)
  const showLeftEllipsis = leftSibling > 2
  const showRightEllipsis = rightSibling < totalPages - 1

  const pages: (number | 'ellipsis')[] = [1]
  if (showLeftEllipsis) pages.push('ellipsis')
  for (let i = leftSibling; i <= rightSibling; i++) {
    if (i !== 1 && i !== totalPages) pages.push(i)
  }
  if (showRightEllipsis) pages.push('ellipsis')
  if (totalPages !== 1) pages.push(totalPages)
  return pages
}

export interface PaginationProps extends React.ComponentPropsWithoutRef<'nav'> {
  /** 1-indexed current page. */
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  /** Page numbers shown on each side of the current page. Default 1. */
  siblingCount?: number
}

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  ({ className, page, totalPages, onPageChange, siblingCount = 1, ...props }, ref) => {
    const pages = getPageList(page, totalPages, siblingCount)

    const goTo = (target: number) => {
      if (target >= 1 && target <= totalPages && target !== page) onPageChange(target)
    }

    return (
      <nav ref={ref} aria-label="pagination" className={cn('flex items-center gap-1', className)} {...props}>
        <button
          type="button"
          aria-label="Trang trước"
          disabled={page <= 1}
          onClick={() => goTo(page - 1)}
          className="inline-flex h-9 items-center rounded-md px-sm text-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
        >
          Trước
        </button>
        {pages.map((p, i) =>
          p === 'ellipsis' ? (
            <span key={`ellipsis-${i}`} aria-hidden="true" className="flex h-9 w-9 items-center justify-center text-muted-foreground">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              aria-current={p === page ? 'page' : undefined}
              onClick={() => goTo(p)}
              className={cn(
                'inline-flex h-9 w-9 items-center justify-center rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
                p === page && 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
              )}
            >
              {p}
            </button>
          )
        )}
        <button
          type="button"
          aria-label="Trang sau"
          disabled={page >= totalPages}
          onClick={() => goTo(page + 1)}
          className="inline-flex h-9 items-center rounded-md px-sm text-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
        >
          Sau
        </button>
      </nav>
    )
  }
)
Pagination.displayName = 'Pagination'

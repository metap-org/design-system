import * as React from 'react'
import { cn } from '../../lib/utils'

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  )
)
Skeleton.displayName = 'Skeleton'

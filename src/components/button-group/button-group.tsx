import * as React from 'react'
import { cn } from '../../lib/utils'

// Pure layout wrapper — visually merges adjacent Button/IconButton children into one connected
// control (shared border, single set of rounded corners at the ends). No Radix needed: same
// reasoning as Breadcrumb/Pagination in docs/component-status.md — no focus-trap/portal/positioning
// required for a static layout container. Consumers pass their own <Button>/<IconButton> children
// with matching `variant`/`size` — ButtonGroup does not clone or inject props into them.
export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
}

const ORIENTATION_CLASSES: Record<NonNullable<ButtonGroupProps['orientation']>, string> = {
  horizontal:
    'flex-row [&>*:not(:first-child)]:-ml-px [&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:first-child:not(:last-child)]:rounded-r-none [&>*:last-child:not(:first-child)]:rounded-l-none',
  vertical:
    'flex-col [&>*:not(:first-child)]:-mt-px [&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:first-child:not(:last-child)]:rounded-b-none [&>*:last-child:not(:first-child)]:rounded-t-none',
}

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation = 'horizontal', role = 'group', ...props }, ref) => (
    <div
      ref={ref}
      role={role}
      className={cn(
        'inline-flex isolate [&>*:focus-visible]:z-10 [&>*:hover]:z-[1]',
        ORIENTATION_CLASSES[orientation],
        className
      )}
      {...props}
    />
  )
)
ButtonGroup.displayName = 'ButtonGroup'

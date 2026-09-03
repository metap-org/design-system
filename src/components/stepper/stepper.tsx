import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

// Stepper = a horizontal sequence of steps connected by a line, each step optionally holding
// more than one item (a branch point — two states reachable from the same point in a process).
// Deliberately data-agnostic: it knows nothing about workflows, entities, or any business
// concept — a caller (e.g. `@metap/platform-ui`'s WorkflowStepper) supplies the sequence and
// which item is "current"/"terminal"/etc. via `variant`. Same compound-component shape as
// Breadcrumb (Stepper/StepperGroup/StepperItem/StepperConnector), composed by the caller rather
// than driven by one big data prop, so a caller can insert arbitrary content (a tooltip, a link)
// around any item without this component needing to know about it.

export type StepperProps = React.ComponentPropsWithoutRef<'div'>

export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="list"
      className={cn('flex flex-wrap items-start gap-1.5', className)}
      {...props}
    />
  )
)
Stepper.displayName = 'Stepper'

// One position in the sequence. Usually holds a single StepperItem; more than one means a
// branch point shared by several items (rendered stacked), still connected as one step to its
// neighbors.
export type StepperGroupProps = React.ComponentPropsWithoutRef<'div'>

export const StepperGroup = React.forwardRef<HTMLDivElement, StepperGroupProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col items-start gap-1', className)} {...props} />
  )
)
StepperGroup.displayName = 'StepperGroup'

export const stepperItemVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-sm py-1 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        current: 'border-transparent bg-primary text-primary-foreground',
        terminal: 'border-2 border-foreground bg-background text-foreground',
        default: 'border-border bg-muted text-muted-foreground',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export type StepperItemProps = React.ComponentPropsWithoutRef<'div'> &
  VariantProps<typeof stepperItemVariants>

export const StepperItem = React.forwardRef<HTMLDivElement, StepperItemProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      role="listitem"
      className={cn(stepperItemVariants({ variant }), className)}
      {...props}
    />
  )
)
StepperItem.displayName = 'StepperItem'

// The line + arrowhead between two StepperGroups — presentational only (aria-hidden), same
// treatment as BreadcrumbSeparator. Rendered by the caller between groups, not automatically:
// this component has no idea how many groups exist or where they sit in a caller's array.
export type StepperConnectorProps = React.ComponentPropsWithoutRef<'div'>

export const StepperConnector = ({ className, ...props }: StepperConnectorProps) => (
  <div
    role="presentation"
    aria-hidden="true"
    className={cn('mt-3.5 flex w-4 flex-shrink-0 items-center sm:w-6', className)}
    {...props}
  >
    <svg viewBox="0 0 24 24" fill="none" className="w-full">
      <line x1="0" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="2" className="text-border" />
      <path d="M14 7l6 5-6 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-border" />
    </svg>
  </div>
)

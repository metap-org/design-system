import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { Spinner } from '../spinner/spinner'

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      size: {
        default: 'h-10 px-md py-sm',
        sm: 'h-9 px-sm',
        lg: 'h-11 px-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Shows a spinner before the button's children and forces `disabled` — replaces the
   *  `<Spinner size="sm" className="mr-2" /> + disabled` pattern hand-repeated at call sites
   *  before this prop existed (see docs/component-status.md's Button row). */
  loading?: boolean
  /** Renders `buttonVariants` styling onto the single child element instead of a `<button>` —
   *  the shadcn/ui `asChild` convention, via Radix's `Slot`. Fixes the gap noted in
   *  `platform-ui/README.md`: no polymorphism equivalent to Mantine's `component={Link}`, so
   *  every nav-link had to hand-render `navAdapter.Link`/`<a>` with `buttonVariants(...)`'s
   *  className instead of an actual `<Button>`. Not compatible with `loading` (a `Slot` has no
   *  button semantics of its own to disable/mark busy) — `loading` is ignored when `asChild`. */
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading = false, asChild = false, disabled, children, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props}>
          {children}
        </Slot>
      )
    }
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? <Spinner size="sm" className="mr-2" label="" /> : null}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

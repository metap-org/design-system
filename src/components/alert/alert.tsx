import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

export const alertVariants = cva('relative w-full rounded-lg border p-md text-sm', {
  variants: {
    variant: {
      default: 'border-border bg-background text-foreground',
      destructive: 'border-destructive/50 bg-destructive/10 text-destructive',
    },
  },
  defaultVariants: { variant: 'default' },
})

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
  )
)
Alert.displayName = 'Alert'

export type AlertTitleProps = React.HTMLAttributes<HTMLHeadingElement>

export const AlertTitle = React.forwardRef<HTMLParagraphElement, AlertTitleProps>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn('mb-1 font-medium leading-none', className)} {...props} />
  )
)
AlertTitle.displayName = 'AlertTitle'

export type AlertDescriptionProps = React.HTMLAttributes<HTMLDivElement>

export const AlertDescription = React.forwardRef<HTMLDivElement, AlertDescriptionProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
  )
)
AlertDescription.displayName = 'AlertDescription'

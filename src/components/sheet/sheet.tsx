import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

// Sheet = a Dialog styled as a slide-in side panel — same @radix-ui/react-dialog
// primitive as Dialog, different Content positioning/animation per `side`.
export const Sheet = DialogPrimitive.Root
export const SheetTrigger = DialogPrimitive.Trigger
export const SheetClose = DialogPrimitive.Close
export const SheetPortal = DialogPrimitive.Portal

export const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-foreground/50 transition-opacity duration-200',
      'data-[state=closed]:opacity-0 data-[state=open]:opacity-100',
      className
    )}
    {...props}
  />
))
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName

const sheetContentVariants = cva(
  'fixed z-50 flex flex-col gap-md bg-background p-lg shadow-lg transition-transform duration-200',
  {
    variants: {
      side: {
        right:
          'inset-y-0 right-0 h-full w-full max-w-sm border-l border-border data-[state=closed]:translate-x-full data-[state=open]:translate-x-0',
        left: 'inset-y-0 left-0 h-full w-full max-w-sm border-r border-border data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0',
        top: 'inset-x-0 top-0 border-b border-border data-[state=closed]:-translate-y-full data-[state=open]:translate-y-0',
        bottom:
          'inset-x-0 bottom-0 border-t border-border data-[state=closed]:translate-y-full data-[state=open]:translate-y-0',
      },
    },
    defaultVariants: { side: 'right' },
  }
)

export interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof sheetContentVariants> {}

export const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(({ side, className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(sheetContentVariants({ side }), className)}
      {...props}
    >
      {children}
      <DialogPrimitive.Close
        className="absolute right-md top-md rounded-md opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Đóng"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = DialogPrimitive.Content.displayName

export const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col gap-1.5', className)} {...props} />
)
SheetHeader.displayName = 'SheetHeader'

export const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mt-auto flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)} {...props} />
)
SheetFooter.displayName = 'SheetFooter'

export const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))
SheetTitle.displayName = DialogPrimitive.Title.displayName

export const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
SheetDescription.displayName = DialogPrimitive.Description.displayName

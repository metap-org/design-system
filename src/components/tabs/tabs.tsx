import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '../../lib/utils'

/**
 * `orientation="vertical"` turns the list into a side menu: full-width items stacked on the left
 * of the content (lay the root out as a row, e.g. `className="flex gap-6"`), for a settings page
 * with more sections than fit side by side.
 */
export const Tabs = TabsPrimitive.Root

export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
      'data-[orientation=vertical]:h-auto data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch data-[orientation=vertical]:justify-start data-[orientation=vertical]:gap-0.5 data-[orientation=vertical]:bg-transparent data-[orientation=vertical]:p-0',
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-md px-sm py-1.5 text-sm font-medium transition-[color,background-color,box-shadow]',
      'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30',
      'disabled:pointer-events-none disabled:opacity-50',
      'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
      'data-[orientation=vertical]:justify-start data-[orientation=vertical]:rounded-md data-[orientation=vertical]:px-3 data-[orientation=vertical]:py-2 data-[orientation=vertical]:hover:bg-muted data-[orientation=vertical]:hover:text-foreground',
      'data-[orientation=vertical]:data-[state=active]:bg-muted data-[orientation=vertical]:data-[state=active]:shadow-none',
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

export const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-md focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30 data-[orientation=vertical]:mt-0 data-[orientation=vertical]:min-w-0 data-[orientation=vertical]:flex-1',
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

import * as React from 'react'
import { cn } from '../../lib/utils'

export interface ToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label?: string
  size?: 'sm' | 'md'
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, checked, onCheckedChange, label, size = 'md', disabled, id, ...props }, ref) => {
    const generatedId = React.useId()
    const buttonId = id ?? generatedId

    return (
      <div className="flex items-center gap-sm">
        <button
          ref={ref}
          id={buttonId}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => onCheckedChange(!checked)}
          className={cn(
            'relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent',
            'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            size === 'sm' ? 'h-5 w-9' : 'h-6 w-11',
            checked ? 'bg-primary' : 'bg-input',
            className
          )}
          {...props}
        >
          <span
            className={cn(
              'pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform',
              size === 'sm' ? 'h-4 w-4' : 'h-5 w-5',
              size === 'sm'
                ? checked ? 'translate-x-4' : 'translate-x-0'
                : checked ? 'translate-x-5' : 'translate-x-0'
            )}
          />
        </button>
        {label && (
          <label
            htmlFor={buttonId}
            className={cn(
              'text-sm text-foreground cursor-pointer select-none',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            {label}
          </label>
        )}
      </div>
    )
  }
)
Toggle.displayName = 'Toggle'

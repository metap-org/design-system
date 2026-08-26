import * as React from 'react'
import { cn } from '../../lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, startAdornment, endAdornment, id, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id ?? generatedId
    const descId = `${inputId}-desc`

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {startAdornment && (
            <span className="pointer-events-none absolute left-md flex items-center text-muted-foreground">
              {startAdornment}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-describedby={error || helperText ? descId : undefined}
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-background px-md py-sm text-sm text-foreground',
              'placeholder:text-muted-foreground',
              'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              startAdornment && 'pl-9',
              endAdornment && 'pr-9',
              error && 'border-destructive focus-visible:ring-destructive',
              className
            )}
            {...props}
          />
          {endAdornment && (
            <span className="pointer-events-none absolute right-md flex items-center text-muted-foreground">
              {endAdornment}
            </span>
          )}
        </div>
        {error && (
          <p id={descId} role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={descId} className="text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

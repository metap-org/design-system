import * as React from 'react'
import { cn } from '../../lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const generatedId = React.useId()
    const textareaId = id ?? generatedId
    const descId = `${textareaId}-desc`

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          aria-describedby={error || helperText ? descId : undefined}
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-input bg-background px-md py-sm text-sm text-foreground',
            'placeholder:text-muted-foreground',
            'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          {...props}
        />
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
Textarea.displayName = 'Textarea'

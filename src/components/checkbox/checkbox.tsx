import * as React from 'react'
import { cn } from '../../lib/utils'

export interface CheckboxProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: string
  indeterminate?: boolean
  disabled?: boolean
  id?: string
  className?: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, label, indeterminate, disabled, id }, ref) => {
    const generatedId = React.useId()
    const inputId = id ?? generatedId
    const innerRef = React.useRef<HTMLInputElement>(null)

    React.useImperativeHandle(ref, () => innerRef.current!)

    React.useEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = indeterminate ?? false
      }
    }, [indeterminate])

    return (
      <div className={cn('flex items-center gap-sm', className)}>
        <div className="relative h-4 w-4 shrink-0">
          <input
            ref={innerRef}
            id={inputId}
            type="checkbox"
            checked={checked}
            onChange={(e) => onCheckedChange?.(e.target.checked)}
            disabled={disabled}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          />
          <div
            className={cn(
              'pointer-events-none h-4 w-4 rounded border border-input bg-background',
              'flex items-center justify-center transition-colors',
              (checked || indeterminate) && 'border-primary bg-primary',
              disabled && 'opacity-50',
            )}
          >
            {checked && !indeterminate && (
              <svg
                className="h-3 w-3 text-primary-foreground"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 6l3 3 5-5" />
              </svg>
            )}
            {indeterminate && (
              <svg
                className="h-3 w-3 text-primary-foreground"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M2.5 6h7" />
              </svg>
            )}
          </div>
        </div>
        {label && (
          <label
            htmlFor={inputId}
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
Checkbox.displayName = 'Checkbox'

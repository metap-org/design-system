import * as React from 'react'
import { cn } from '../../lib/utils'

export interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type'> {
  label?: string
  error?: string
  helperText?: string
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    { className, label, error, helperText, value, defaultValue, onChange, min, max, step = 1, id, disabled, ...props },
    ref
  ) => {
    const isControlled = value !== undefined
    const [internalValue, setInternalValue] = React.useState<number | undefined>(defaultValue)
    const currentValue = isControlled ? value : internalValue

    const generatedId = React.useId()
    const inputId = id ?? generatedId
    const descId = `${inputId}-desc`

    const clamp = (n: number) => {
      let result = n
      if (min !== undefined) result = Math.max(min, result)
      if (max !== undefined) result = Math.min(max, result)
      return result
    }

    const commit = (next: number) => {
      const clamped = clamp(next)
      if (!isControlled) setInternalValue(clamped)
      onChange?.(clamped)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value
      if (raw === '') {
        if (!isControlled) setInternalValue(undefined)
        return
      }
      const parsed = Number(raw)
      if (Number.isNaN(parsed)) return
      if (!isControlled) setInternalValue(parsed)
      onChange?.(parsed)
    }

    const atMax = max !== undefined && (currentValue ?? 0) >= max
    const atMin = min !== undefined && (currentValue ?? 0) <= min

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <input
            ref={ref}
            id={inputId}
            type="number"
            inputMode="decimal"
            value={currentValue ?? ''}
            onChange={handleInputChange}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            aria-describedby={error || helperText ? descId : undefined}
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-background px-md py-sm pr-9 text-sm text-foreground',
              'placeholder:text-muted-foreground',
              'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
              error && 'border-destructive focus-visible:ring-destructive',
              className
            )}
            {...props}
          />
          <div className="absolute right-1 flex flex-col">
            <button
              type="button"
              tabIndex={-1}
              aria-label="Tăng"
              disabled={disabled || atMax}
              onClick={() => commit((currentValue ?? 0) + step)}
              className="flex h-4 w-6 items-center justify-center text-muted-foreground hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1.5 6.5 5 3l3.5 3.5" />
              </svg>
            </button>
            <button
              type="button"
              tabIndex={-1}
              aria-label="Giảm"
              disabled={disabled || atMin}
              onClick={() => commit((currentValue ?? 0) - step)}
              className="flex h-4 w-6 items-center justify-center text-muted-foreground hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1.5 3.5 5 7l3.5-3.5" />
              </svg>
            </button>
          </div>
        </div>
        {error && (
          <p id={descId} role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={descId} className="text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
NumberInput.displayName = 'NumberInput'

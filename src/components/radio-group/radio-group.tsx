import * as React from 'react'
import { cn } from '../../lib/utils'

interface RadioGroupContextValue {
  value: string
  onValueChange: (value: string) => void
  name: string
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null)

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  onValueChange: (value: string) => void
  name?: string
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, onValueChange, name, children, ...props }, ref) => {
    const generatedName = React.useId()
    return (
      <RadioGroupContext.Provider value={{ value, onValueChange, name: name ?? generatedName }}>
        <div
          ref={ref}
          role="radiogroup"
          className={cn('flex flex-col gap-sm', className)}
          {...props}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    )
  }
)
RadioGroup.displayName = 'RadioGroup'

export interface RadioGroupItemProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'checked' | 'onChange' | 'name'> {
  value: string
  label?: string
}

export const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, label, id, disabled, ...props }, ref) => {
    const ctx = React.useContext(RadioGroupContext)
    const generatedId = React.useId()
    const inputId = id ?? generatedId
    const isChecked = ctx?.value === value

    return (
      <div className={cn('flex items-center gap-sm', className)}>
        <div className="relative h-4 w-4 shrink-0">
          <input
            ref={ref}
            id={inputId}
            type="radio"
            name={ctx?.name}
            value={value}
            checked={isChecked}
            onChange={() => ctx?.onValueChange(value)}
            disabled={disabled}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
            {...props}
          />
          <div
            className={cn(
              'pointer-events-none h-4 w-4 rounded-full border border-input bg-background',
              'flex items-center justify-center transition-colors',
              isChecked && 'border-primary',
              disabled && 'opacity-50',
            )}
          >
            {isChecked && <div className="h-2 w-2 rounded-full bg-primary" />}
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
RadioGroupItem.displayName = 'RadioGroupItem'

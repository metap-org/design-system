import * as React from 'react'
import { DayPicker } from 'react-day-picker'
import { cn } from '../../lib/utils'

export interface DatePickerProps {
  value?: Date | null
  onValueChange?: (date: Date | null) => void
  placeholder?: string
  label?: string
  error?: string
  helperText?: string
  disabled?: boolean
  className?: string
  id?: string
}

export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      value,
      onValueChange,
      placeholder = 'Pick a date',
      label,
      error,
      helperText,
      disabled,
      className,
      id,
    },
    ref
  ) => {
    const generatedId = React.useId()
    const triggerId = id ?? generatedId
    const descId = `${triggerId}-desc`
    const calendarId = `${triggerId}-calendar`

    const [open, setOpen] = React.useState(false)
    const [month, setMonth] = React.useState<Date>(value ?? new Date())

    const wrapperRef = React.useRef<HTMLDivElement>(null)

    const formatted = value
      ? value.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      : undefined

    const handleSelect = (date: Date | undefined) => {
      onValueChange?.(date ?? null)
      setOpen(false)
    }

    React.useEffect(() => {
      if (!open) return
      const handler = (e: MouseEvent) => {
        if (!wrapperRef.current?.contains(e.target as Node)) {
          setOpen(false)
        }
      }
      document.addEventListener('mousedown', handler)
      return () => document.removeEventListener('mousedown', handler)
    }, [open])

    React.useEffect(() => {
      if (value) setMonth(value)
    }, [value])

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={triggerId} className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <div ref={wrapperRef} className="relative">
          <button
            ref={ref}
            id={triggerId}
            type="button"
            disabled={disabled}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls={open ? calendarId : undefined}
            aria-describedby={error || helperText ? descId : undefined}
            onClick={() => setOpen(prev => !prev)}
            className={cn(
              'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-md py-sm text-sm',
              'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              !formatted && 'text-muted-foreground',
              error && 'border-destructive focus-visible:ring-destructive',
              className
            )}
          >
            <span>{formatted ?? placeholder}</span>
            <svg
              className="h-4 w-4 shrink-0 text-muted-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </button>

          {open && (
            <div
              id={calendarId}
              role="dialog"
              aria-label="Date picker"
              className="absolute z-50 mt-1 rounded-md border border-border bg-popover p-md shadow-md"
            >
              <DayPicker
                mode="single"
                selected={value ?? undefined}
                onSelect={handleSelect}
                month={month}
                onMonthChange={setMonth}
                classNames={dayPickerClassNames}
              />
            </div>
          )}
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
DatePicker.displayName = 'DatePicker'

const dayPickerClassNames = {
  months: 'flex flex-col gap-sm',
  month: 'flex flex-col gap-sm',
  month_caption: 'flex items-center justify-between px-sm',
  caption_label: 'text-sm font-medium text-foreground',
  nav: 'flex items-center gap-xs',
  button_previous: cn(
    'inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background text-foreground',
    'hover:bg-accent hover:text-accent-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  ),
  button_next: cn(
    'inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background text-foreground',
    'hover:bg-accent hover:text-accent-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  ),
  month_grid: 'w-full border-collapse',
  weekdays: 'flex',
  weekday: 'w-9 text-center text-xs font-medium text-muted-foreground py-xs',
  week: 'flex',
  day: 'relative p-0',
  day_button: cn(
    'inline-flex h-9 w-9 items-center justify-center rounded-md text-sm text-foreground',
    'hover:bg-accent hover:text-accent-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:hover:bg-primary aria-selected:hover:text-primary-foreground',
    'transition-colors'
  ),
  today: 'font-semibold text-primary',
  outside: 'opacity-40',
  disabled: 'opacity-40 cursor-not-allowed',
  hidden: 'invisible',
}

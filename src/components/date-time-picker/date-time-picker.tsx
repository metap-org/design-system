import * as React from 'react'
import { DayPicker } from 'react-day-picker'
import { cn } from '../../lib/utils'
import { dayPickerClassNames } from '../date-picker/day-picker-classnames'

// `DatePicker` only ever picks a calendar day (no time-of-day component) — this is its
// datetime-capable sibling, added because field kind `"datetime"` was reusing `DatePicker` and
// silently losing the hour:minute:second part on every round trip (see
// docs/component-status.md's Gap đã biết list, carried over from platform-ui/README.md before the
// fix). Kept as a separate component rather than a `DatePicker` prop so `DatePicker` stays a pure
// date-only picker for callers that only ever want a day.
export interface DateTimePickerProps {
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

function withTimeOfDay(date: Date, time: Date): Date {
  const next = new Date(date)
  next.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), 0)
  return next
}

function timeInputValue(date: Date | null | undefined): string {
  if (!date) return ''
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

export const DateTimePicker = React.forwardRef<HTMLButtonElement, DateTimePickerProps>(
  (
    {
      value,
      onValueChange,
      placeholder = 'Pick a date & time',
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
      ? value.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : undefined

    const handleSelectDate = (date: Date | undefined) => {
      if (!date) {
        onValueChange?.(null)
        return
      }
      onValueChange?.(value ? withTimeOfDay(date, value) : date)
    }

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!value) return
      const [hh, mm, ss] = e.target.value.split(':').map(Number)
      const next = new Date(value)
      next.setHours(hh ?? 0, mm ?? 0, ss ?? 0, 0)
      onValueChange?.(next)
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
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </button>

          {open && (
            <div
              id={calendarId}
              role="dialog"
              aria-label="Date & time picker"
              className="absolute z-50 mt-1 flex flex-col gap-sm rounded-md border border-border bg-popover p-md shadow-md"
            >
              <DayPicker
                mode="single"
                selected={value ?? undefined}
                onSelect={handleSelectDate}
                month={month}
                onMonthChange={setMonth}
                classNames={dayPickerClassNames}
              />
              <div className="flex items-center gap-2 border-t border-border pt-sm">
                <label htmlFor={`${triggerId}-time`} className="text-sm text-muted-foreground">
                  Time
                </label>
                <input
                  id={`${triggerId}-time`}
                  type="time"
                  step={1}
                  disabled={!value}
                  value={timeInputValue(value)}
                  onChange={handleTimeChange}
                  className={cn(
                    'flex-1 rounded-md border border-input bg-background px-sm py-1 text-sm',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
                    'disabled:cursor-not-allowed disabled:opacity-50'
                  )}
                />
              </div>
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
DateTimePicker.displayName = 'DateTimePicker'

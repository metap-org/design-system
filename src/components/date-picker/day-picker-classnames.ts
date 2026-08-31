import { cn } from '../../lib/utils'

// Shared `react-day-picker` classNames map — used by both `DatePicker` and `DateTimePicker` so
// the calendar grid looks identical regardless of which picker renders it.
export const dayPickerClassNames = {
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

import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { cn } from '../../lib/utils'

export interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}

// Radix's `Select.Item` forbids an empty-string `value` (it's reserved internally to mean "no
// selection"), but several real callers model "All"/"no filter" as an option with `value: ""`
// (e.g. AnalyticsPage's zone filter, `LowCodeEntitiesAdminPage`'s "no default sort"). Remapped to
// this sentinel only at the Radix boundary — every prop this component exposes (`value`,
// `onValueChange`, `options`) still speaks plain `""`, so no caller needs to know this exists.
const EMPTY_VALUE_SENTINEL = '__metap-select-empty__'
const toItemValue = (value: string) => (value === '' ? EMPTY_VALUE_SENTINEL : value)
const fromItemValue = (value: string) => (value === EMPTY_VALUE_SENTINEL ? '' : value)

export interface SelectProps
  extends Omit<React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>, 'onChange' | 'value' | 'defaultValue'> {
  options: SelectOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  label?: string
  error?: string
  helperText?: string
}

/**
 * Built on `@radix-ui/react-select` (2026-09-05, replacing a hand-rolled, non-portaled
 * implementation — the same architecture every other interactive `@metap/ui` component already
 * uses: `Dialog`/`DropdownMenu`/`Popover`/`Tabs`/`Tooltip`/`Accordion`). The hand-rolled version's
 * dropdown was a plain `position: absolute` `<ul>` with no Portal, and — separately, the actual
 * bug this migration was triggered by — its trigger was a bare `<button>`, so a caller mistakenly
 * wiring the DOM's generic `onChange` (which exists on every element's props, not just form
 * controls) instead of this component's real `onValueChange` compiled cleanly but never fired on
 * click, since a `<button>` never emits a native `change` event
 * (`metap-demo-waf/data-plane/web` had exactly this typo at 9 call sites — fixed alongside this
 * migration). `Omit<..., 'onChange'>` above turns that typo into a real compile error for any
 * future caller instead of a silent no-op.
 */
export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    { className, options, value, onValueChange, placeholder = 'Select an option', label, error, helperText, disabled, id, ...props },
    ref,
  ) => {
    const generatedId = React.useId()
    const triggerId = id ?? generatedId

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={triggerId} className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        {/* No `modal` prop here — unlike `Dialog`, this Radix version's `Select.Content` calls
            the underlying `hideOthers()`/scroll-lock unconditionally (confirmed by reading
            `@radix-ui/react-select`'s own source), so there's no way to opt out of it. While
            open, the rest of the page (including this trigger) gets `pointer-events: none` —
            harmless for a real user (Radix's own document-level pointerup listener still detects
            and handles "clicked outside" regardless of that CSS, since it doesn't depend on the
            target element's own event handlers firing), but it does mean
            `@testing-library/user-event`'s default strict pointer-events check can't simulate
            those 2 interactions — see `select.test.tsx`'s own note on the 2 tests that need
            `pointerEventsCheck: 0`. */}
        <SelectPrimitive.Root
          value={value === '' ? EMPTY_VALUE_SENTINEL : value}
          onValueChange={(next) => onValueChange?.(fromItemValue(next))}
          disabled={disabled}
        >
          <SelectPrimitive.Trigger
            ref={ref}
            id={triggerId}
            {...props}
            className={cn(
              'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-md py-sm text-sm',
              'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'data-[placeholder]:text-muted-foreground',
              error && 'border-destructive focus-visible:ring-destructive',
              className,
            )}
          >
            <span className="truncate">
              <SelectPrimitive.Value placeholder={placeholder} />
            </span>
            <SelectPrimitive.Icon asChild>
              <svg
                className="h-4 w-4 shrink-0 text-muted-foreground transition-transform data-[state=open]:rotate-180"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>
          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              className="z-50 max-h-60 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md"
              position="popper"
              sideOffset={4}
            >
              <SelectPrimitive.Viewport className="p-1">
                {options.map((option) => (
                  <SelectPrimitive.Item
                    key={option.value}
                    value={toItemValue(option.value)}
                    disabled={option.disabled}
                    className={cn(
                      'relative flex cursor-pointer select-none items-center rounded-sm px-md py-sm text-sm outline-none',
                      'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
                      'data-[state=checked]:font-medium',
                      'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
                    )}
                  >
                    <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                  </SelectPrimitive.Item>
                ))}
              </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        {!error && helperText && <p className="text-sm text-muted-foreground">{helperText}</p>}
      </div>
    )
  },
)
Select.displayName = 'Select'

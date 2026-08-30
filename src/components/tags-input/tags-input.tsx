import * as React from 'react'
import { cn } from '../../lib/utils'
import { Chip } from '../chip'

export interface TagsInputProps {
  value: string[]
  onChange: (next: string[]) => void
  placeholder?: string
  label?: string
  error?: string
  helperText?: string
  /** Values not yet in `value`, rendered as click-to-add outline chips below the input — for a
   *  caller that knows a closed or commonly-used set of values (roles already assigned to some
   *  user, an entity's enum values, ...) without forcing the field itself into a closed Select. */
  suggestions?: string[]
  className?: string
  disabled?: boolean
}

// Free-text array editor: removable Chip per value + a text input, Enter/comma commits a new
// tag, Backspace on an empty draft removes the last tag. Distinct from Select/Combobox (closed,
// single-value) and from a plain Input (single string) — this is the multi-value, open-set case
// (policy roles, ABAC `in`/`notIn` literals, enum/terminal-state lists).
export const TagsInput = React.forwardRef<HTMLInputElement, TagsInputProps>(
  (
    { value, onChange, placeholder, label, error, helperText, suggestions, className, disabled },
    ref
  ) => {
    const [draft, setDraft] = React.useState('')
    const generatedId = React.useId()
    const inputId = generatedId
    const descId = `${inputId}-desc`

    const commit = () => {
      const v = draft.trim()
      if (v && !value.includes(v)) {
        onChange([...value, v])
      }
      setDraft('')
    }

    const remove = (tag: string) => {
      onChange(value.filter((v) => v !== tag))
    }

    const remainingSuggestions = (suggestions ?? []).filter((s) => !value.includes(s))

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <div
          className={cn(
            'flex flex-wrap items-center gap-1 rounded-md border border-input bg-background px-md py-sm',
            'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
            error && 'border-destructive focus-within:ring-destructive',
            disabled && 'cursor-not-allowed opacity-50',
            className
          )}
        >
          {value.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              variant="secondary"
              onClose={disabled ? undefined : () => remove(tag)}
            />
          ))}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-describedby={error || helperText ? descId : undefined}
            className="min-w-[100px] flex-1 bg-transparent py-0.5 text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
            placeholder={placeholder}
            value={draft}
            onChange={(e) => setDraft(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault()
                commit()
              } else if (e.key === 'Backspace' && draft.length === 0 && value.length > 0) {
                remove(value[value.length - 1])
              }
            }}
            onBlur={commit}
          />
        </div>
        {remainingSuggestions.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {remainingSuggestions.map((s) => (
              <Chip
                key={s}
                label={s}
                variant="outline"
                className="cursor-pointer"
                onClick={() => !disabled && onChange([...value, s])}
              />
            ))}
          </div>
        )}
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
TagsInput.displayName = 'TagsInput'

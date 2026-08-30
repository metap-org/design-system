import * as React from 'react'
import { cn } from '../../lib/utils'
import { Badge } from '../badge'
import { Select } from '../select'

export interface MultiSelectOption {
  label: string
  value: string
  disabled?: boolean
}

export interface MultiSelectProps {
  options: MultiSelectOption[]
  value: string[]
  onChange: (next: string[]) => void
  label?: string
  placeholder?: string
  error?: string
  helperText?: string
  className?: string
}

// Fixed-option multi-select: selected values render as removable Badges, a plain Select beneath
// adds one more from whatever isn't already picked. Distinct from `TagsInput` (open-ended,
// free-text values) — this is for a closed set of valid options (entity field names, enum
// values from a known list, ...).
export const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    { options, value, onChange, label, placeholder = 'Add…', error, helperText, className },
    ref
  ) => {
    const available = options.filter((o) => !value.includes(o.value))
    const labelFor = (v: string) => options.find((o) => o.value === v)?.label ?? v

    return (
      <div ref={ref} className={cn('flex flex-col gap-1', className)}>
        {label && <label className="text-sm font-medium text-foreground">{label}</label>}
        {value.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {value.map((v) => (
              <Badge key={v} variant="secondary" className="gap-1">
                {labelFor(v)}
                <button
                  type="button"
                  aria-label={`Remove ${labelFor(v)}`}
                  onClick={() => onChange(value.filter((x) => x !== v))}
                  className="text-xs leading-none"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        )}
        {available.length > 0 && (
          <Select
            placeholder={placeholder}
            options={available}
            value={undefined}
            onValueChange={(v) => onChange([...value, v])}
          />
        )}
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        {!error && helperText && <p className="text-sm text-muted-foreground">{helperText}</p>}
      </div>
    )
  }
)
MultiSelect.displayName = 'MultiSelect'

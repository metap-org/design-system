import * as React from 'react'
import { Input, type InputProps } from '../input'
import { Chip } from '../chip'

export interface SuggestInputProps extends Omit<InputProps, 'value' | 'onChange'> {
  value: string
  onChange: (next: string) => void
  /** A fixed or dynamic set of commonly-used values, rendered as click-to-fill outline chips
   *  below the input — for a free-text field where the full set of valid values isn't
   *  enumerable (e.g. a caller's dynamic request-context keys), but a handful of the most common
   *  ones still are. Clicking a chip replaces the current value entirely (single-value, unlike
   *  `TagsInput`'s click-to-add). */
  suggestions?: string[]
}

// Single-value text input with quick-fill suggestion chips — sits between a plain Input (no
// hinting at all) and a closed Select/Combobox (can't accept a value outside the list). Use this
// when the field is genuinely open-ended but a short list of likely values is still worth
// surfacing.
export const SuggestInput = React.forwardRef<HTMLInputElement, SuggestInputProps>(
  ({ value, onChange, suggestions, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      <Input ref={ref} value={value} onChange={(e) => onChange(e.currentTarget.value)} {...props} />
      {suggestions && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {suggestions.map((s) => (
            <Chip
              key={s}
              label={s}
              variant={value === s ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => onChange(s)}
            />
          ))}
        </div>
      )}
    </div>
  )
)
SuggestInput.displayName = 'SuggestInput'

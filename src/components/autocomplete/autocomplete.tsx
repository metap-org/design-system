import * as React from 'react'
import { cn } from '../../lib/utils'

export interface AutocompleteOption {
  label: string
  value: string
  disabled?: boolean
}

// Module-level, not `options: staticOptions = []` inline — a default *parameter* literal is a
// new array every render it applies to (i.e. whenever the caller omits `options`, the exact
// `onSearch`-without-`options` shape a search-as-you-type consumer uses). That reference feeds
// straight into the filter `useEffect`'s dependency array below, so on every render it looks
// "changed" even though it's logically still empty — re-triggering the effect, which (in the
// `onSearch` branch) calls `setLoading`/`setFilteredOptions`, causing another render, another
// "new" empty array, and so on forever. Found live via `autocomplete.test.tsx`'s onSearch test,
// which reliably ran the suite out of heap (~2GB, several minutes) before this fix — not a test
// bug, a real infinite-render loop in this component whenever `onSearch` was used without
// `options`.
const EMPTY_OPTIONS: AutocompleteOption[] = []

export interface AutocompleteProps {
  options?: AutocompleteOption[]
  onSearch?: (query: string) => Promise<AutocompleteOption[]> | AutocompleteOption[]
  value?: string
  onValueChange?: (value: string | null) => void
  inputValue?: string
  onInputChange?: (value: string) => void
  label?: string
  error?: string
  helperText?: string
  placeholder?: string
  disabled?: boolean
  className?: string
  id?: string
}

export const Autocomplete = React.forwardRef<HTMLInputElement, AutocompleteProps>(
  (
    {
      className,
      options: staticOptions = EMPTY_OPTIONS,
      onSearch,
      value,
      onValueChange,
      inputValue: controlledInput,
      onInputChange,
      label,
      error,
      helperText,
      placeholder = 'Type to search...',
      disabled,
      id,
    },
    ref
  ) => {
    const generatedId = React.useId()
    const inputId = id ?? generatedId
    const listboxId = `${inputId}-listbox`
    const descId = `${inputId}-desc`

    const [internalInput, setInternalInput] = React.useState('')
    const inputVal = controlledInput !== undefined ? controlledInput : internalInput

    const setInputVal = (v: string) => {
      if (controlledInput === undefined) setInternalInput(v)
      onInputChange?.(v)
    }

    const [filteredOptions, setFilteredOptions] = React.useState<AutocompleteOption[]>(staticOptions)
    const [open, setOpen] = React.useState(false)
    const [activeIndex, setActiveIndex] = React.useState(-1)
    const [loading, setLoading] = React.useState(false)

    const inputRef = React.useRef<HTMLInputElement>(null)
    const listboxRef = React.useRef<HTMLUListElement>(null)
    const wrapperRef = React.useRef<HTMLDivElement>(null)

    React.useImperativeHandle(ref, () => inputRef.current!)

    React.useEffect(() => {
      if (onSearch) {
        const timer = setTimeout(async () => {
          setLoading(true)
          try {
            const result = await onSearch(inputVal)
            setFilteredOptions(result)
          } finally {
            setLoading(false)
          }
        }, 300)
        return () => clearTimeout(timer)
      } else {
        const filtered = staticOptions.filter(o =>
          o.label.toLowerCase().includes(inputVal.toLowerCase())
        )
        setFilteredOptions(filtered)
      }
    }, [inputVal, onSearch, staticOptions])

    const handleSelect = (option: AutocompleteOption) => {
      if (option.disabled) return
      onValueChange?.(option.value)
      setInputVal(option.label)
      setOpen(false)
      setActiveIndex(-1)
    }

    const handleClear = () => {
      onValueChange?.(null)
      setInputVal('')
      setOpen(false)
      inputRef.current?.focus()
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!open) {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setOpen(true)
        }
        return
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
        setActiveIndex(-1)
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex(prev => {
          let next = prev + 1
          while (next < filteredOptions.length && filteredOptions[next].disabled) next++
          return next < filteredOptions.length ? next : prev
        })
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex(prev => {
          let next = prev - 1
          while (next >= 0 && filteredOptions[next].disabled) next--
          return next >= 0 ? next : prev
        })
        return
      }
      if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault()
        handleSelect(filteredOptions[activeIndex])
      }
    }

    React.useEffect(() => {
      if (!open) return
      const handler = (e: MouseEvent) => {
        if (!wrapperRef.current?.contains(e.target as Node)) {
          setOpen(false)
          setActiveIndex(-1)
        }
      }
      document.addEventListener('mousedown', handler)
      return () => document.removeEventListener('mousedown', handler)
    }, [open])

    React.useEffect(() => {
      if (!open || activeIndex < 0 || !listboxRef.current) return
      const item = listboxRef.current.children[activeIndex] as HTMLElement | undefined
      if (item && typeof item.scrollIntoView === 'function') {
        item.scrollIntoView({ block: 'nearest' })
      }
    }, [activeIndex, open])

    const showOptions = open && filteredOptions.length > 0
    const showNoResults = open && !loading && filteredOptions.length === 0 && inputVal.length > 0
    const showLoading = open && loading && filteredOptions.length === 0

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <div ref={wrapperRef} className="relative">
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-controls={open ? listboxId : undefined}
            aria-autocomplete="list"
            aria-activedescendant={activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined}
            aria-describedby={error || helperText ? descId : undefined}
            disabled={disabled}
            placeholder={placeholder}
            value={inputVal}
            onChange={e => {
              setInputVal(e.target.value)
              setOpen(true)
              setActiveIndex(-1)
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-background px-md py-sm text-sm text-foreground',
              value ? 'pr-9' : '',
              'placeholder:text-muted-foreground',
              'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-destructive focus-visible:ring-destructive',
              className
            )}
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear selection"
              tabIndex={-1}
              className="absolute right-md top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus-visible:outline-none"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          )}
          {showOptions && (
            <ul
              ref={listboxRef}
              id={listboxId}
              role="listbox"
              aria-label={label}
              className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-popover py-1 text-sm shadow-md"
            >
              {filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  id={`${listboxId}-${index}`}
                  role="option"
                  aria-selected={option.value === value}
                  aria-disabled={option.disabled}
                  onMouseDown={e => {
                    e.preventDefault()
                    handleSelect(option)
                  }}
                  onMouseEnter={() => !option.disabled && setActiveIndex(index)}
                  className={cn(
                    'cursor-pointer px-md py-sm text-popover-foreground transition-colors',
                    index === activeIndex && !option.disabled && 'bg-accent text-accent-foreground',
                    option.value === value && 'font-medium',
                    option.disabled && 'cursor-not-allowed opacity-50'
                  )}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          )}
          {(showLoading || showNoResults) && (
            <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover px-md py-sm text-sm text-muted-foreground shadow-md">
              {showLoading ? 'Loading...' : 'No results found'}
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
Autocomplete.displayName = 'Autocomplete'

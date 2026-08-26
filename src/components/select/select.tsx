import * as React from 'react'
import { cn } from '../../lib/utils'

export interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}

export interface SelectProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  options: SelectOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  label?: string
  error?: string
  helperText?: string
  disabled?: boolean
}

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      className,
      options,
      value,
      onValueChange,
      placeholder = 'Select an option',
      label,
      error,
      helperText,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const triggerId = id ?? generatedId
    const listboxId = `${triggerId}-listbox`
    const [open, setOpen] = React.useState(false)
    const [activeIndex, setActiveIndex] = React.useState(-1)
    const triggerRef = React.useRef<HTMLButtonElement>(null)
    const listboxRef = React.useRef<HTMLUListElement>(null)

    React.useImperativeHandle(ref, () => triggerRef.current!)

    const selected = options.find(o => o.value === value)

    const handleOpen = () => {
      if (disabled) return
      setOpen(true)
      const idx = selected ? options.findIndex(o => o.value === selected.value) : -1
      setActiveIndex(idx)
    }

    const handleClose = () => {
      setOpen(false)
      setActiveIndex(-1)
    }

    const handleSelect = (option: SelectOption) => {
      if (option.disabled) return
      onValueChange?.(option.value)
      handleClose()
      triggerRef.current?.focus()
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return
      if (!open) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
          e.preventDefault()
          handleOpen()
        }
        return
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        handleClose()
        triggerRef.current?.focus()
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex(prev => {
          let next = prev + 1
          while (next < options.length && options[next].disabled) next++
          return next < options.length ? next : prev
        })
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex(prev => {
          let next = prev - 1
          while (next >= 0 && options[next].disabled) next--
          return next >= 0 ? next : prev
        })
        return
      }
      if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault()
        handleSelect(options[activeIndex])
      }
    }

    React.useEffect(() => {
      if (!open) return
      const handler = (e: MouseEvent) => {
        if (
          !triggerRef.current?.contains(e.target as Node) &&
          !listboxRef.current?.contains(e.target as Node)
        ) {
          handleClose()
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

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={triggerId} className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <div className="relative">
          <button
            ref={triggerRef}
            id={triggerId}
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-controls={open ? listboxId : undefined}
            aria-activedescendant={activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined}
            disabled={disabled}
            onClick={() => (open ? handleClose() : handleOpen())}
            onKeyDown={handleKeyDown}
            {...props}
            className={cn(
              'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-md py-sm text-sm',
              'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              !selected && 'text-muted-foreground',
              error && 'border-destructive focus-visible:ring-destructive',
              className
            )}
          >
            <span className="truncate">{selected ? selected.label : placeholder}</span>
            <svg
              className={cn(
                'h-4 w-4 shrink-0 text-muted-foreground transition-transform',
                open && 'rotate-180'
              )}
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
          </button>
          {open && (
            <ul
              ref={listboxRef}
              id={listboxId}
              role="listbox"
              aria-label={label}
              className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-popover py-1 text-sm shadow-md"
            >
              {options.map((option, index) => (
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
        </div>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    )
  }
)
Select.displayName = 'Select'

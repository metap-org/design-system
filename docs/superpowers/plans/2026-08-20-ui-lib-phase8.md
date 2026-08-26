# UI Lib Phase 8 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add five complex UI components to `@ui/ui-lib` — Select, Toast (imperative API), Autocomplete, DatePicker, and DateRangePicker.

**Architecture:** Each component is a self-contained directory under `src/components/`. Select and Autocomplete share the same visual dropdown pattern (listbox, ARIA combobox). Toast uses a module-level listener set for its imperative `toast()` API plus a `<ToastProvider>` that renders into a portal. DatePicker and DateRangePicker wrap react-day-picker@^9 with Tailwind classNames overrides.

**Tech Stack:** React 18, TypeScript strict, CVA (class-variance-authority), Tailwind CSS v3, react-day-picker@^9, Vitest, @testing-library/react, @testing-library/user-event, Storybook 8.

## Global Constraints

- `@ui/ui-lib` package name — never change.
- React / React-DOM stay in `peerDependencies` only — never add to `dependencies` or `devDependencies`.
- `react-day-picker` goes in `dependencies` (runtime library dep).
- All Tailwind classes must be semantic token classes (`bg-primary`, `text-foreground`, `border-input`, `rounded-md`, etc.) or standard Tailwind utilities (`h-10`, `w-full`, `text-sm`, `shadow-md`). **No arbitrary values** (`w-[120px]`, `bg-[#fff]`).
- Available semantic color tokens: `background`, `foreground`, `primary`/`primary-foreground`, `secondary`/`secondary-foreground`, `destructive`/`destructive-foreground`, `muted`/`muted-foreground`, `accent`/`accent-foreground`, `popover`/`popover-foreground`, `card`/`card-foreground`, `border`, `input`, `ring`.
- Available spacing tokens (extend Tailwind spacing): `xs`=0.5rem, `sm`=0.75rem, `md`=1rem, `lg`=1.5rem, `xl`=2rem. Use `gap-sm`, `px-md`, `py-sm`, etc.
- Pattern for every component: `React.forwardRef` + `cn()` from `../../lib/utils` + `displayName` + export types.
- No CVA required for components without multiple variants; use `cn()` directly.
- `dts: false` stays in `tsup.config.ts` — never change it.
- `sideEffects: ["./dist/style.css"]` stays in `package.json` — never set `sideEffects: false`.
- `pnpm` for all installs (not npm or yarn).
- Node ≥ 18.
- Every component export added to `src/index.ts`.
- Every new directory needs an `index.ts` barrel re-exporting from the implementation file.
- Tests: describe/it blocks, `vi.fn()`, `userEvent.*`, `screen.*`, assertions against rendered DOM — no snapshot tests.

---

### Task 1: Select

**Files:**
- Create: `src/components/select/select.tsx`
- Create: `src/components/select/index.ts`
- Create: `src/components/select/select.test.tsx`
- Create: `src/components/select/select.stories.tsx`
- Modify: `src/index.ts` — add Select exports

**Interfaces:**
- Produces: `Select` (forwardRef → `HTMLButtonElement`), `SelectOption`, `SelectProps`

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/select/select.test.tsx
import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Select } from './select'

const OPTIONS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry', disabled: true },
]

describe('Select', () => {
  it('renders trigger with placeholder when no value', () => {
    render(<Select options={OPTIONS} placeholder="Pick a fruit" />)
    expect(screen.getByRole('combobox')).toHaveTextContent('Pick a fruit')
  })

  it('renders selected label when value matches', () => {
    render(<Select options={OPTIONS} value="banana" />)
    expect(screen.getByRole('combobox')).toHaveTextContent('Banana')
  })

  it('opens listbox on click', async () => {
    render(<Select options={OPTIONS} />)
    const trigger = screen.getByRole('combobox')
    expect(screen.queryByRole('listbox')).toBeNull()
    await userEvent.click(trigger)
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('closes listbox when clicking trigger again', async () => {
    render(<Select options={OPTIONS} />)
    const trigger = screen.getByRole('combobox')
    await userEvent.click(trigger)
    await userEvent.click(trigger)
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('closes listbox when clicking outside', async () => {
    render(
      <div>
        <Select options={OPTIONS} />
        <button>Outside</button>
      </div>
    )
    await userEvent.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    await userEvent.click(screen.getByText('Outside'))
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('calls onValueChange when an option is clicked', async () => {
    const handleChange = vi.fn()
    render(<Select options={OPTIONS} onValueChange={handleChange} />)
    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.click(screen.getByRole('option', { name: 'Apple' }))
    expect(handleChange).toHaveBeenCalledWith('apple')
  })

  it('does not call onValueChange for disabled option', async () => {
    const handleChange = vi.fn()
    render(<Select options={OPTIONS} onValueChange={handleChange} />)
    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.click(screen.getByRole('option', { name: 'Cherry' }))
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('closes listbox after selecting an option', async () => {
    render(<Select options={OPTIONS} onValueChange={vi.fn()} />)
    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.click(screen.getByRole('option', { name: 'Apple' }))
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('opens with ArrowDown key and marks aria-expanded', async () => {
    render(<Select options={OPTIONS} />)
    const trigger = screen.getByRole('combobox')
    trigger.focus()
    await userEvent.keyboard('{ArrowDown}')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('closes with Escape key', async () => {
    render(<Select options={OPTIONS} />)
    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('renders label and associates it with trigger', () => {
    render(<Select options={OPTIONS} label="Fruit" />)
    expect(screen.getByText('Fruit')).toBeInTheDocument()
    // label htmlFor should match trigger id
    const label = screen.getByText('Fruit')
    const trigger = screen.getByRole('combobox')
    expect(label.getAttribute('for')).toBe(trigger.getAttribute('id'))
  })

  it('renders error message with role=alert', () => {
    render(<Select options={OPTIONS} error="Required" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Required')
  })

  it('renders helperText when no error', () => {
    render(<Select options={OPTIONS} helperText="Pick one" />)
    expect(screen.getByText('Pick one')).toBeInTheDocument()
  })

  it('does not render helperText when error is present', () => {
    render(<Select options={OPTIONS} error="Error" helperText="Pick one" />)
    expect(screen.queryByText('Pick one')).toBeNull()
  })

  it('is disabled when disabled prop is set', () => {
    render(<Select options={OPTIONS} disabled />)
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('does not open when disabled', async () => {
    render(<Select options={OPTIONS} disabled />)
    await userEvent.click(screen.getByRole('combobox'))
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('marks selected option with aria-selected=true', async () => {
    render(<Select options={OPTIONS} value="banana" />)
    await userEvent.click(screen.getByRole('combobox'))
    const selected = screen.getByRole('option', { name: 'Banana' })
    expect(selected).toHaveAttribute('aria-selected', 'true')
  })

  it('marks disabled option with aria-disabled=true', async () => {
    render(<Select options={OPTIONS} />)
    await userEvent.click(screen.getByRole('combobox'))
    const disabled = screen.getByRole('option', { name: 'Cherry' })
    expect(disabled).toHaveAttribute('aria-disabled', 'true')
  })

  it('forwards ref to trigger button', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Select options={OPTIONS} ref={ref} />)
    expect(ref.current?.tagName).toBe('BUTTON')
  })

  it('merges custom className onto trigger', () => {
    render(<Select options={OPTIONS} className="extra-class" />)
    expect(screen.getByRole('combobox')).toHaveClass('extra-class')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test -- --reporter=verbose src/components/select/select.test.tsx
```

Expected: multiple failures — `select.tsx` does not exist yet.

- [ ] **Step 3: Implement Select**

```tsx
// src/components/select/select.tsx
import * as React from 'react'
import { cn } from '../../lib/utils'

export interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}

export interface SelectProps {
  options: SelectOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  label?: string
  error?: string
  helperText?: string
  disabled?: boolean
  className?: string
  id?: string
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
      item?.scrollIntoView({ block: 'nearest' })
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
            disabled={disabled}
            onClick={() => (open ? handleClose() : handleOpen())}
            onKeyDown={handleKeyDown}
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
```

```ts
// src/components/select/index.ts
export { Select, type SelectOption, type SelectProps } from './select'
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm test -- --reporter=verbose src/components/select/select.test.tsx
```

Expected: all tests pass.

- [ ] **Step 5: Write Storybook story**

```tsx
// src/components/select/select.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { Select } from './select'

const OPTIONS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Durian (unavailable)', value: 'durian', disabled: true },
]

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  args: { options: OPTIONS },
}
export default meta

type Story = StoryObj<typeof Select>

export const Default: Story = {}

export const WithValue: Story = {
  args: { value: 'banana', onValueChange: () => {} },
}

export const WithLabel: Story = {
  args: { label: 'Favourite Fruit', placeholder: 'Pick one' },
}

export const WithError: Story = {
  args: { label: 'Fruit', error: 'Selection is required' },
}

export const WithHelperText: Story = {
  args: { label: 'Fruit', helperText: 'Choose your favourite' },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState('')
    return (
      <Select
        options={OPTIONS}
        value={value}
        onValueChange={setValue}
        label="Fruit"
        placeholder="Select..."
      />
    )
  },
}
```

- [ ] **Step 6: Add export to `src/index.ts`**

Append after the Toggle export:

```ts
export { Select, type SelectOption, type SelectProps } from './components/select'
```

- [ ] **Step 7: Run full test suite**

```bash
pnpm test:run
```

Expected: all tests pass.

- [ ] **Step 8: Commit**

```bash
git add src/components/select/ src/index.ts
git commit -m "feat: Select component — custom dropdown, ARIA combobox, keyboard nav"
```

---

### Task 2: Toast

**Files:**
- Create: `src/components/toast/toast.tsx`
- Create: `src/components/toast/index.ts`
- Create: `src/components/toast/toast.test.tsx`
- Create: `src/components/toast/toast.stories.tsx`
- Modify: `src/index.ts` — add Toast exports

**Interfaces:**
- Produces: `toast(message, opts?)` imperative function, `ToastProvider`, `ToastVariant`, `ToastEntry`

**Implementation notes:**
- `toast()` is a module-level function that dispatches to all registered listeners.
- `ToastProvider` registers/deregisters a listener via `useEffect` on mount/unmount.
- Auto-dismiss after `duration` ms (default 4000). `duration: 0` = no auto-dismiss.
- Portal renders into `document.body`. Guard with `typeof document !== 'undefined'` for SSR safety.
- Two variants: `default` (bg-background border-border) and `destructive` (bg-destructive).

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/toast/toast.test.tsx
import * as React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { toast, ToastProvider } from './toast'

// Helper: render with provider
function renderWithProvider(ui?: React.ReactNode) {
  return render(<ToastProvider>{ui ?? <div />}</ToastProvider>)
}

describe('toast / ToastProvider', () => {
  it('renders children without crashing', () => {
    renderWithProvider(<span>Child</span>)
    expect(screen.getByText('Child')).toBeInTheDocument()
  })

  it('shows a toast message when toast() is called', async () => {
    renderWithProvider()
    act(() => { toast('Hello world') })
    await screen.findByRole('alert')
    expect(screen.getByRole('alert')).toHaveTextContent('Hello world')
  })

  it('shows multiple toasts', async () => {
    renderWithProvider()
    act(() => {
      toast('First')
      toast('Second')
    })
    const alerts = await screen.findAllByRole('alert')
    expect(alerts).toHaveLength(2)
    expect(alerts[0]).toHaveTextContent('First')
    expect(alerts[1]).toHaveTextContent('Second')
  })

  it('renders default variant with background classes', async () => {
    renderWithProvider()
    act(() => { toast('Info') })
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveClass('bg-background')
  })

  it('renders destructive variant', async () => {
    renderWithProvider()
    act(() => { toast('Error!', { variant: 'destructive' }) })
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveClass('bg-destructive')
  })

  it('dismisses toast when dismiss button is clicked', async () => {
    renderWithProvider()
    act(() => { toast('Dismissable', { duration: 0 }) })
    await screen.findByRole('alert')
    const dismissBtn = screen.getByRole('button', { name: /dismiss/i })
    await userEvent.click(dismissBtn)
    await waitFor(() => {
      expect(screen.queryByRole('alert')).toBeNull()
    })
  })

  it('auto-dismisses after duration ms', async () => {
    vi.useFakeTimers()
    renderWithProvider()
    act(() => { toast('Auto', { duration: 1000 }) })
    await screen.findByRole('alert')
    act(() => { vi.advanceTimersByTime(1100) })
    await waitFor(() => {
      expect(screen.queryByRole('alert')).toBeNull()
    })
    vi.useRealTimers()
  })

  it('does not auto-dismiss when duration is 0', async () => {
    vi.useFakeTimers()
    renderWithProvider()
    act(() => { toast('Sticky', { duration: 0 }) })
    await screen.findByRole('alert')
    act(() => { vi.advanceTimersByTime(10000) })
    expect(screen.getByRole('alert')).toBeInTheDocument()
    vi.useRealTimers()
  })

  it('toast() has no effect when no provider is mounted', () => {
    // Should not throw
    expect(() => toast('No provider')).not.toThrow()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test -- --reporter=verbose src/components/toast/toast.test.tsx
```

Expected: multiple failures — `toast.tsx` does not exist yet.

- [ ] **Step 3: Implement Toast**

```tsx
// src/components/toast/toast.tsx
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { cn } from '../../lib/utils'

export type ToastVariant = 'default' | 'destructive'

export interface ToastEntry {
  id: string
  message: string
  variant: ToastVariant
  duration: number
}

const listeners = new Set<(t: ToastEntry) => void>()
let _counter = 0

export function toast(
  message: string,
  opts?: { variant?: ToastVariant; duration?: number }
): void {
  const entry: ToastEntry = {
    id: String(++_counter),
    message,
    variant: opts?.variant ?? 'default',
    duration: opts?.duration ?? 4000,
  }
  listeners.forEach(l => l(entry))
}

interface ToastItemProps extends ToastEntry {
  onDismiss: () => void
}

function ToastItem({ message, variant, duration, onDismiss }: ToastItemProps) {
  React.useEffect(() => {
    if (duration <= 0) return
    const timer = setTimeout(onDismiss, duration)
    return () => clearTimeout(timer)
  }, [duration, onDismiss])

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={cn(
        'flex items-start justify-between gap-md rounded-md border px-md py-sm shadow-lg',
        'min-w-64 max-w-sm text-sm',
        variant === 'default' && 'border-border bg-background text-foreground',
        variant === 'destructive' &&
          'border-destructive bg-destructive text-destructive-foreground'
      )}
    >
      <span className="flex-1">{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className={cn(
          'shrink-0 opacity-70 hover:opacity-100',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1'
        )}
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
    </div>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastEntry[]>([])

  React.useEffect(() => {
    const handler = (t: ToastEntry) => setToasts(prev => [...prev, t])
    listeners.add(handler)
    return () => {
      listeners.delete(handler)
    }
  }, [])

  const dismiss = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <>
      {children}
      {typeof document !== 'undefined' &&
        ReactDOM.createPortal(
          <div
            aria-label="Notifications"
            className="fixed bottom-md right-md z-50 flex flex-col gap-sm"
          >
            {toasts.map(t => (
              <ToastItem key={t.id} {...t} onDismiss={() => dismiss(t.id)} />
            ))}
          </div>,
          document.body
        )}
    </>
  )
}
```

```ts
// src/components/toast/index.ts
export { toast, ToastProvider, type ToastVariant, type ToastEntry } from './toast'
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm test -- --reporter=verbose src/components/toast/toast.test.tsx
```

Expected: all tests pass.

- [ ] **Step 5: Write Storybook story**

```tsx
// src/components/toast/toast.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { toast, ToastProvider } from './toast'

const meta: Meta = {
  title: 'Components/Toast',
  decorators: [
    Story => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <button
      type="button"
      className="rounded-md bg-primary px-md py-sm text-sm text-primary-foreground"
      onClick={() => toast('File saved successfully')}
    >
      Show Toast
    </button>
  ),
}

export const Destructive: Story = {
  render: () => (
    <button
      type="button"
      className="rounded-md bg-destructive px-md py-sm text-sm text-destructive-foreground"
      onClick={() => toast('Something went wrong', { variant: 'destructive' })}
    >
      Show Error Toast
    </button>
  ),
}

export const Sticky: Story = {
  render: () => (
    <button
      type="button"
      className="rounded-md bg-primary px-md py-sm text-sm text-primary-foreground"
      onClick={() => toast('This toast stays until dismissed', { duration: 0 })}
    >
      Show Sticky Toast
    </button>
  ),
}
```

- [ ] **Step 6: Add export to `src/index.ts`**

Append:

```ts
export { toast, ToastProvider, type ToastVariant, type ToastEntry } from './components/toast'
```

- [ ] **Step 7: Run full test suite**

```bash
pnpm test:run
```

Expected: all tests pass.

- [ ] **Step 8: Commit**

```bash
git add src/components/toast/ src/index.ts
git commit -m "feat: Toast — imperative toast() API, ToastProvider portal, auto-dismiss"
```

---

### Task 3: Autocomplete

**Files:**
- Create: `src/components/autocomplete/autocomplete.tsx`
- Create: `src/components/autocomplete/index.ts`
- Create: `src/components/autocomplete/autocomplete.test.tsx`
- Create: `src/components/autocomplete/autocomplete.stories.tsx`
- Modify: `src/index.ts` — add Autocomplete exports

**Interfaces:**
- Consumes: SelectOption dropdown pattern (same visual structure, different trigger element)
- Produces: `Autocomplete` (forwardRef → `HTMLInputElement`), `AutocompleteOption`, `AutocompleteProps`

**Implementation notes:**
- Two modes: local filter (`options` prop) and async search (`onSearch` callback).
- If both are provided: show `options` as initial list; when `onSearch` resolves it replaces.
- Debounce `onSearch` by 300 ms.
- Controlled input: if `inputValue` and `onInputChange` are provided, use them; otherwise manage internally.
- Show "No results found" when open, not loading, no options, and inputVal is non-empty.
- Show "Loading..." when loading.
- Clear button (×) appears when `value` is set; clicking it calls `onValueChange(null)` and clears input.
- ARIA: `role="combobox"` on input, `aria-autocomplete="list"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`.
- Each option `li` gets `id={listboxId}-{index}` for `aria-activedescendant` linking.
- Close on outside click using `data-autocomplete` attribute on wrapper div.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/autocomplete/autocomplete.test.tsx
import * as React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Autocomplete } from './autocomplete'

const OPTIONS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Apricot', value: 'apricot' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry', disabled: true },
]

describe('Autocomplete', () => {
  it('renders an input with role=combobox', () => {
    render(<Autocomplete options={OPTIONS} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('shows options on focus', async () => {
    render(<Autocomplete options={OPTIONS} />)
    await userEvent.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('filters options by input value (local mode)', async () => {
    render(<Autocomplete options={OPTIONS} />)
    await userEvent.type(screen.getByRole('combobox'), 'ap')
    const items = screen.getAllByRole('option')
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveTextContent('Apple')
    expect(items[1]).toHaveTextContent('Apricot')
  })

  it('calls onValueChange with selected value', async () => {
    const handleChange = vi.fn()
    render(<Autocomplete options={OPTIONS} onValueChange={handleChange} />)
    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.click(screen.getByRole('option', { name: 'Banana' }))
    expect(handleChange).toHaveBeenCalledWith('banana')
  })

  it('does not call onValueChange for disabled option', async () => {
    const handleChange = vi.fn()
    render(<Autocomplete options={OPTIONS} onValueChange={handleChange} />)
    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.click(screen.getByRole('option', { name: 'Cherry' }))
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('closes listbox after selecting an option', async () => {
    render(<Autocomplete options={OPTIONS} onValueChange={vi.fn()} />)
    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.click(screen.getByRole('option', { name: 'Apple' }))
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('shows clear button when value is set', () => {
    render(<Autocomplete options={OPTIONS} value="apple" inputValue="Apple" onValueChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument()
  })

  it('clears selection when clear button is clicked', async () => {
    const handleChange = vi.fn()
    render(
      <Autocomplete
        options={OPTIONS}
        value="apple"
        inputValue="Apple"
        onValueChange={handleChange}
        onInputChange={vi.fn()}
      />
    )
    await userEvent.click(screen.getByRole('button', { name: /clear/i }))
    expect(handleChange).toHaveBeenCalledWith(null)
  })

  it('calls onSearch with input text (async mode)', async () => {
    const onSearch = vi.fn().mockResolvedValue([{ label: 'Mango', value: 'mango' }])
    render(<Autocomplete onSearch={onSearch} />)
    await userEvent.type(screen.getByRole('combobox'), 'man')
    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith('man')
    })
  })

  it('shows results from onSearch', async () => {
    const onSearch = vi.fn().mockResolvedValue([{ label: 'Mango', value: 'mango' }])
    render(<Autocomplete onSearch={onSearch} />)
    await userEvent.type(screen.getByRole('combobox'), 'm')
    await waitFor(() => {
      expect(screen.queryByRole('option', { name: 'Mango' })).toBeInTheDocument()
    })
  })

  it('shows "No results found" when filter yields nothing', async () => {
    render(<Autocomplete options={OPTIONS} />)
    await userEvent.type(screen.getByRole('combobox'), 'zzz')
    expect(screen.getByText('No results found')).toBeInTheDocument()
  })

  it('navigates options with arrow keys', async () => {
    render(<Autocomplete options={OPTIONS} />)
    const input = screen.getByRole('combobox')
    await userEvent.click(input)
    await userEvent.keyboard('{ArrowDown}')
    // First non-disabled option is highlighted
    const firstOption = screen.getAllByRole('option')[0]
    expect(firstOption).toHaveClass('bg-accent')
  })

  it('closes on Escape key', async () => {
    render(<Autocomplete options={OPTIONS} />)
    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('renders label associated with input', () => {
    render(<Autocomplete options={OPTIONS} label="Search" />)
    const label = screen.getByText('Search')
    const input = screen.getByRole('combobox')
    expect(label.getAttribute('for')).toBe(input.getAttribute('id'))
  })

  it('renders error with role=alert', () => {
    render(<Autocomplete options={OPTIONS} error="Required" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Required')
  })

  it('renders helperText when no error', () => {
    render(<Autocomplete options={OPTIONS} helperText="Start typing" />)
    expect(screen.getByText('Start typing')).toBeInTheDocument()
  })

  it('is disabled when disabled prop is set', () => {
    render(<Autocomplete options={OPTIONS} disabled />)
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('forwards ref to input element', () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<Autocomplete options={OPTIONS} ref={ref} />)
    expect(ref.current?.tagName).toBe('INPUT')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test -- --reporter=verbose src/components/autocomplete/autocomplete.test.tsx
```

Expected: multiple failures — `autocomplete.tsx` does not exist yet.

- [ ] **Step 3: Implement Autocomplete**

```tsx
// src/components/autocomplete/autocomplete.tsx
import * as React from 'react'
import { cn } from '../../lib/utils'

export interface AutocompleteOption {
  label: string
  value: string
  disabled?: boolean
}

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
      options: staticOptions = [],
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
      item?.scrollIntoView({ block: 'nearest' })
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
            aria-activedescendant={
              activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined
            }
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
Autocomplete.displayName = 'Autocomplete'
```

```ts
// src/components/autocomplete/index.ts
export {
  Autocomplete,
  type AutocompleteOption,
  type AutocompleteProps,
} from './autocomplete'
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm test -- --reporter=verbose src/components/autocomplete/autocomplete.test.tsx
```

Expected: all tests pass.

- [ ] **Step 5: Write Storybook story**

```tsx
// src/components/autocomplete/autocomplete.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { Autocomplete } from './autocomplete'

const FRUITS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Apricot', value: 'apricot' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Durian (unavailable)', value: 'durian', disabled: true },
  { label: 'Elderberry', value: 'elderberry' },
  { label: 'Fig', value: 'fig' },
  { label: 'Grape', value: 'grape' },
]

const meta: Meta<typeof Autocomplete> = {
  title: 'Components/Autocomplete',
  component: Autocomplete,
}
export default meta

type Story = StoryObj<typeof Autocomplete>

export const LocalFilter: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | null>(null)
    return (
      <Autocomplete
        options={FRUITS}
        value={value ?? undefined}
        onValueChange={setValue}
        label="Fruit (local filter)"
        placeholder="Type to filter..."
      />
    )
  },
}

export const AsyncSearch: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | null>(null)
    const onSearch = async (q: string) => {
      await new Promise(r => setTimeout(r, 500))
      return FRUITS.filter(f => f.label.toLowerCase().includes(q.toLowerCase()))
    }
    return (
      <Autocomplete
        onSearch={onSearch}
        value={value ?? undefined}
        onValueChange={setValue}
        label="Fruit (async search)"
        placeholder="Type to search..."
      />
    )
  },
}

export const WithError: Story = {
  args: {
    options: FRUITS,
    label: 'Fruit',
    error: 'Please select a fruit',
  },
}

export const Disabled: Story = {
  args: {
    options: FRUITS,
    label: 'Fruit',
    disabled: true,
  },
}
```

- [ ] **Step 6: Add export to `src/index.ts`**

Append:

```ts
export {
  Autocomplete,
  type AutocompleteOption,
  type AutocompleteProps,
} from './components/autocomplete'
```

- [ ] **Step 7: Run full test suite**

```bash
pnpm test:run
```

Expected: all tests pass.

- [ ] **Step 8: Commit**

```bash
git add src/components/autocomplete/ src/index.ts
git commit -m "feat: Autocomplete — local filter + async search, ARIA combobox, keyboard nav"
```

---

### Task 4: DatePicker

**Files:**
- Create: `src/components/date-picker/date-picker.tsx`
- Create: `src/components/date-picker/index.ts`
- Create: `src/components/date-picker/date-picker.test.tsx`
- Create: `src/components/date-picker/date-picker.stories.tsx`
- Modify: `src/index.ts` — add DatePicker exports

**Install react-day-picker (do this before Step 1):**

```bash
pnpm add react-day-picker@^9
```

**Interfaces:**
- Produces: `DatePicker` (forwardRef → `HTMLButtonElement`), `DatePickerProps`

**Implementation notes:**
- Trigger is an Input-styled button showing the formatted date (`date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })`) or the placeholder when no date is selected.
- Calendar popup is absolutely positioned below the trigger using `DayPicker` from `react-day-picker`.
- Override DayPicker styles entirely via the `classNames` prop — do NOT import `react-day-picker/style.css`.
- `mode="single"`, `selected={value ?? undefined}`, `onSelect={d => onValueChange?.(d ?? null)}`.
- Close on outside click (same `useRef` + `mousedown` pattern as Select).
- Optional `fromDate` and `toDate` props map to `DayPicker`'s `startMonth`/`endMonth` or `disabled` prop.

**DayPicker v9 classNames keys to override** (check actual types from installed package if a key doesn't exist):

```ts
const dayPickerClassNames = {
  root: 'p-md',
  months: 'flex flex-col gap-md',
  month: 'flex flex-col gap-sm',
  month_caption: 'flex items-center justify-between px-sm pb-sm',
  caption_label: 'text-sm font-medium text-foreground',
  nav: 'flex items-center gap-xs',
  button_previous: cn(
    'h-7 w-7 inline-flex items-center justify-center rounded-md border border-input bg-background',
    'text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  ),
  button_next: cn(
    'h-7 w-7 inline-flex items-center justify-center rounded-md border border-input bg-background',
    'text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  ),
  month_grid: 'w-full border-collapse',
  weekdays: 'flex',
  weekday: 'text-muted-foreground w-9 text-xs font-normal text-center py-1',
  week: 'flex w-full mt-1',
  day: 'h-9 w-9 text-center text-sm relative p-0',
  day_button: cn(
    'h-9 w-9 p-0 font-normal rounded-md inline-flex items-center justify-center w-full',
    'hover:bg-accent hover:text-accent-foreground transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
    'disabled:cursor-not-allowed disabled:opacity-50'
  ),
  selected: 'bg-primary text-primary-foreground rounded-md hover:bg-primary hover:text-primary-foreground',
  today: 'bg-accent text-accent-foreground font-medium rounded-md',
  outside: 'opacity-40',
  disabled: 'opacity-30 cursor-not-allowed',
  hidden: 'invisible',
}
```

- [ ] **Step 1: Install react-day-picker and write the failing test**

```bash
pnpm add react-day-picker@^9
```

```tsx
// src/components/date-picker/date-picker.test.tsx
import * as React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { DatePicker } from './date-picker'

describe('DatePicker', () => {
  it('renders trigger button', () => {
    render(<DatePicker />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('shows placeholder when no value', () => {
    render(<DatePicker placeholder="Pick a date" />)
    expect(screen.getByRole('button')).toHaveTextContent('Pick a date')
  })

  it('shows formatted date when value is set', () => {
    const date = new Date(2025, 0, 15) // Jan 15, 2025
    render(<DatePicker value={date} />)
    // Just check it doesn't show the placeholder
    expect(screen.getByRole('button')).not.toHaveTextContent('Pick a date')
  })

  it('opens calendar on click', async () => {
    render(<DatePicker />)
    await userEvent.click(screen.getByRole('button'))
    // DayPicker renders a grid
    expect(screen.getByRole('grid')).toBeInTheDocument()
  })

  it('closes calendar when clicking outside', async () => {
    render(
      <div>
        <DatePicker />
        <button>Outside</button>
      </div>
    )
    await userEvent.click(screen.getByRole('button', { name: /pick/i }))
    expect(screen.getByRole('grid')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /outside/i }))
    await waitFor(() => {
      expect(screen.queryByRole('grid')).toBeNull()
    })
  })

  it('renders label associated with trigger button', () => {
    render(<DatePicker label="Start Date" />)
    expect(screen.getByText('Start Date')).toBeInTheDocument()
  })

  it('renders error with role=alert', () => {
    render(<DatePicker error="Date required" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Date required')
  })

  it('renders helperText when no error', () => {
    render(<DatePicker helperText="Select any date" />)
    expect(screen.getByText('Select any date')).toBeInTheDocument()
  })

  it('is disabled when disabled prop is set', () => {
    render(<DatePicker disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('does not open when disabled', async () => {
    render(<DatePicker disabled />)
    await userEvent.click(screen.getByRole('button'))
    expect(screen.queryByRole('grid')).toBeNull()
  })

  it('forwards ref to trigger button', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<DatePicker ref={ref} />)
    expect(ref.current?.tagName).toBe('BUTTON')
  })

  it('calls onValueChange when a date is selected', async () => {
    const handleChange = vi.fn()
    render(<DatePicker onValueChange={handleChange} />)
    await userEvent.click(screen.getByRole('button'))
    // Click the first available day button
    const dayButtons = screen.getAllByRole('button', { name: /\d+/ })
    const firstAvailable = dayButtons.find(b => !b.hasAttribute('disabled'))
    if (firstAvailable) {
      await userEvent.click(firstAvailable)
      expect(handleChange).toHaveBeenCalledWith(expect.any(Date))
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test -- --reporter=verbose src/components/date-picker/date-picker.test.tsx
```

Expected: multiple failures — `date-picker.tsx` does not exist yet.

- [ ] **Step 3: Implement DatePicker**

```tsx
// src/components/date-picker/date-picker.tsx
import * as React from 'react'
import { DayPicker } from 'react-day-picker'
import { cn } from '../../lib/utils'

export interface DatePickerProps {
  value?: Date | null
  onValueChange?: (date: Date | null) => void
  label?: string
  error?: string
  helperText?: string
  placeholder?: string
  disabled?: boolean
  fromDate?: Date
  toDate?: Date
  className?: string
  id?: string
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const calendarClassNames = {
  root: 'p-md',
  months: 'flex flex-col gap-md',
  month: 'flex flex-col gap-sm',
  month_caption: 'flex items-center justify-between px-sm pb-sm',
  caption_label: 'text-sm font-medium text-foreground',
  nav: 'flex items-center gap-xs',
  button_previous: cn(
    'h-7 w-7 inline-flex items-center justify-center rounded-md border border-input bg-background',
    'text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors',
    'disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
  ),
  button_next: cn(
    'h-7 w-7 inline-flex items-center justify-center rounded-md border border-input bg-background',
    'text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors',
    'disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
  ),
  month_grid: 'w-full border-collapse',
  weekdays: 'flex',
  weekday: 'text-muted-foreground w-9 text-xs font-normal text-center py-1',
  week: 'flex w-full mt-1',
  day: 'h-9 w-9 text-center text-sm relative p-0',
  day_button: cn(
    'h-9 w-9 p-0 font-normal rounded-md inline-flex items-center justify-center w-full',
    'text-foreground hover:bg-accent hover:text-accent-foreground transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
    'disabled:cursor-not-allowed disabled:opacity-30'
  ),
  selected:
    'bg-primary text-primary-foreground rounded-md [&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground',
  today: '[&>button]:font-semibold [&>button]:underline',
  outside: 'opacity-40',
  disabled: 'opacity-30',
  hidden: 'invisible',
}

export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      className,
      value,
      onValueChange,
      label,
      error,
      helperText,
      placeholder = 'Pick a date',
      disabled,
      fromDate,
      toDate,
      id,
    },
    ref
  ) => {
    const generatedId = React.useId()
    const triggerId = id ?? generatedId
    const [open, setOpen] = React.useState(false)
    const triggerRef = React.useRef<HTMLButtonElement>(null)
    const popoverRef = React.useRef<HTMLDivElement>(null)

    React.useImperativeHandle(ref, () => triggerRef.current!)

    React.useEffect(() => {
      if (!open) return
      const handler = (e: MouseEvent) => {
        if (
          !triggerRef.current?.contains(e.target as Node) &&
          !popoverRef.current?.contains(e.target as Node)
        ) {
          setOpen(false)
        }
      }
      document.addEventListener('mousedown', handler)
      return () => document.removeEventListener('mousedown', handler)
    }, [open])

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
            disabled={disabled}
            onClick={() => setOpen(o => !o)}
            className={cn(
              'flex h-10 w-full items-center justify-start rounded-md border border-input bg-background px-md py-sm text-sm',
              'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              !value && 'text-muted-foreground',
              error && 'border-destructive focus-visible:ring-destructive',
              className
            )}
          >
            <svg
              className="mr-sm h-4 w-4 shrink-0 text-muted-foreground"
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
            <span className="truncate">
              {value ? formatDate(value) : placeholder}
            </span>
          </button>
          {open && (
            <div
              ref={popoverRef}
              className="absolute z-50 mt-1 rounded-md border border-border bg-popover shadow-md"
            >
              <DayPicker
                mode="single"
                selected={value ?? undefined}
                onSelect={d => {
                  onValueChange?.(d ?? null)
                  setOpen(false)
                }}
                disabled={fromDate || toDate
                  ? { before: fromDate, after: toDate }
                  : undefined}
                classNames={calendarClassNames}
              />
            </div>
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
DatePicker.displayName = 'DatePicker'
```

```ts
// src/components/date-picker/index.ts
export { DatePicker, type DatePickerProps } from './date-picker'
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm test -- --reporter=verbose src/components/date-picker/date-picker.test.tsx
```

Expected: all tests pass.

- [ ] **Step 5: Write Storybook story**

```tsx
// src/components/date-picker/date-picker.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { DatePicker } from './date-picker'

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
}
export default meta

type Story = StoryObj<typeof DatePicker>

export const Default: Story = {}

export const WithLabel: Story = {
  args: { label: 'Start Date', placeholder: 'Select a date' },
}

export const WithValue: Story = {
  args: { value: new Date(2025, 5, 15), label: 'Date' },
}

export const WithError: Story = {
  args: { label: 'Date', error: 'Date is required' },
}

export const Disabled: Story = {
  args: { label: 'Date', disabled: true },
}

export const WithRange: Story = {
  args: {
    label: 'Date',
    fromDate: new Date(),
    helperText: 'Only future dates allowed',
  },
}

export const Controlled: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | null>(null)
    return (
      <DatePicker
        value={date}
        onValueChange={setDate}
        label="Pick a date"
        helperText={date ? `Selected: ${date.toDateString()}` : undefined}
      />
    )
  },
}
```

- [ ] **Step 6: Add export to `src/index.ts`**

Append:

```ts
export { DatePicker, type DatePickerProps } from './components/date-picker'
```

- [ ] **Step 7: Run full test suite**

```bash
pnpm test:run
```

Expected: all tests pass.

- [ ] **Step 8: Commit**

```bash
git add src/components/date-picker/ src/index.ts
git commit -m "feat: DatePicker — react-day-picker@^9, Tailwind classNames, single date selection"
```

---

### Task 5: DateRangePicker

**Files:**
- Create: `src/components/date-range-picker/date-range-picker.tsx`
- Create: `src/components/date-range-picker/index.ts`
- Create: `src/components/date-range-picker/date-range-picker.test.tsx`
- Create: `src/components/date-range-picker/date-range-picker.stories.tsx`
- Modify: `src/index.ts` — add DateRangePicker exports

**Interfaces:**
- Consumes: `calendarClassNames` constant and `formatDate()` helper from DatePicker — copy them into `date-range-picker.tsx` (no cross-component import; implementers work independently)
- Produces: `DateRangePicker` (forwardRef → `HTMLButtonElement`), `DateRange`, `DateRangePickerProps`

**Implementation notes:**
- `DateRange = { from: Date | null; to: Date | null }`.
- `DayPicker` `mode="range"` expects `DateRange` as `{ from: Date | undefined; to?: Date | undefined }` — adapt in the `selected` prop.
- Trigger label: show "from → to" if both dates set, "from →" if only from, placeholder otherwise.
- Use the same `calendarClassNames` as DatePicker plus range-specific keys: `range_start`, `range_middle`, `range_end`.
- Same outside-click close pattern as DatePicker.

**DayPicker v9 range classNames additions:**

```ts
range_start: 'rounded-l-md [&>button]:rounded-l-md bg-primary text-primary-foreground [&>button]:bg-primary [&>button]:text-primary-foreground',
range_end: 'rounded-r-md [&>button]:rounded-r-md bg-primary text-primary-foreground [&>button]:bg-primary [&>button]:text-primary-foreground',
range_middle: 'bg-accent text-accent-foreground [&>button]:rounded-none',
```

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/date-range-picker/date-range-picker.test.tsx
import * as React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { DateRangePicker } from './date-range-picker'

describe('DateRangePicker', () => {
  it('renders trigger button', () => {
    render(<DateRangePicker />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('shows placeholder when no value', () => {
    render(<DateRangePicker placeholder="Pick a range" />)
    expect(screen.getByRole('button')).toHaveTextContent('Pick a range')
  })

  it('shows from date when only from is set', () => {
    const from = new Date(2025, 0, 1)
    render(<DateRangePicker value={{ from, to: null }} />)
    const trigger = screen.getByRole('button')
    expect(trigger.textContent).toContain('Jan')
  })

  it('shows range when both dates are set', () => {
    const from = new Date(2025, 0, 1)
    const to = new Date(2025, 0, 15)
    render(<DateRangePicker value={{ from, to }} />)
    const trigger = screen.getByRole('button')
    expect(trigger.textContent).toContain('→')
  })

  it('opens calendar on click', async () => {
    render(<DateRangePicker />)
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('grid')).toBeInTheDocument()
  })

  it('closes calendar when clicking outside', async () => {
    render(
      <div>
        <DateRangePicker />
        <button>Outside</button>
      </div>
    )
    await userEvent.click(screen.getByRole('button', { name: /pick/i }))
    expect(screen.getByRole('grid')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /outside/i }))
    await waitFor(() => {
      expect(screen.queryByRole('grid')).toBeNull()
    })
  })

  it('renders label', () => {
    render(<DateRangePicker label="Date Range" />)
    expect(screen.getByText('Date Range')).toBeInTheDocument()
  })

  it('renders error with role=alert', () => {
    render(<DateRangePicker error="Range required" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Range required')
  })

  it('renders helperText when no error', () => {
    render(<DateRangePicker helperText="Select start and end" />)
    expect(screen.getByText('Select start and end')).toBeInTheDocument()
  })

  it('is disabled when disabled prop is set', () => {
    render(<DateRangePicker disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('does not open when disabled', async () => {
    render(<DateRangePicker disabled />)
    await userEvent.click(screen.getByRole('button'))
    expect(screen.queryByRole('grid')).toBeNull()
  })

  it('forwards ref to trigger button', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<DateRangePicker ref={ref} />)
    expect(ref.current?.tagName).toBe('BUTTON')
  })

  it('calls onValueChange when a date is selected', async () => {
    const handleChange = vi.fn()
    render(<DateRangePicker onValueChange={handleChange} />)
    await userEvent.click(screen.getByRole('button'))
    const dayButtons = screen.getAllByRole('button', { name: /\d+/ })
    const firstAvailable = dayButtons.find(b => !b.hasAttribute('disabled'))
    if (firstAvailable) {
      await userEvent.click(firstAvailable)
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({ from: expect.any(Date) })
      )
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test -- --reporter=verbose src/components/date-range-picker/date-range-picker.test.tsx
```

Expected: multiple failures — `date-range-picker.tsx` does not exist yet.

- [ ] **Step 3: Implement DateRangePicker**

```tsx
// src/components/date-range-picker/date-range-picker.tsx
import * as React from 'react'
import { DayPicker, type DateRange as DayPickerRange } from 'react-day-picker'
import { cn } from '../../lib/utils'

export type DateRange = { from: Date | null; to: Date | null }

export interface DateRangePickerProps {
  value?: DateRange
  onValueChange?: (range: DateRange) => void
  label?: string
  error?: string
  helperText?: string
  placeholder?: string
  disabled?: boolean
  fromDate?: Date
  toDate?: Date
  className?: string
  id?: string
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const calendarClassNames = {
  root: 'p-md',
  months: 'flex flex-col gap-md',
  month: 'flex flex-col gap-sm',
  month_caption: 'flex items-center justify-between px-sm pb-sm',
  caption_label: 'text-sm font-medium text-foreground',
  nav: 'flex items-center gap-xs',
  button_previous: cn(
    'h-7 w-7 inline-flex items-center justify-center rounded-md border border-input bg-background',
    'text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors',
    'disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
  ),
  button_next: cn(
    'h-7 w-7 inline-flex items-center justify-center rounded-md border border-input bg-background',
    'text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors',
    'disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
  ),
  month_grid: 'w-full border-collapse',
  weekdays: 'flex',
  weekday: 'text-muted-foreground w-9 text-xs font-normal text-center py-1',
  week: 'flex w-full mt-1',
  day: 'h-9 w-9 text-center text-sm relative p-0',
  day_button: cn(
    'h-9 w-9 p-0 font-normal rounded-md inline-flex items-center justify-center w-full',
    'text-foreground hover:bg-accent hover:text-accent-foreground transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
    'disabled:cursor-not-allowed disabled:opacity-30'
  ),
  selected:
    'bg-primary text-primary-foreground rounded-md [&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground',
  today: '[&>button]:font-semibold [&>button]:underline',
  outside: 'opacity-40',
  disabled: 'opacity-30',
  hidden: 'invisible',
  range_start:
    'rounded-l-md [&>button]:rounded-l-md [&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary',
  range_end:
    'rounded-r-md [&>button]:rounded-r-md [&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary',
  range_middle:
    'bg-accent text-accent-foreground rounded-none [&>button]:rounded-none [&>button]:hover:bg-accent',
}

function toDayPickerRange(range?: DateRange): DayPickerRange | undefined {
  if (!range) return undefined
  return {
    from: range.from ?? undefined,
    to: range.to ?? undefined,
  }
}

function formatTriggerLabel(range?: DateRange, placeholder?: string): string {
  if (!range || !range.from) return placeholder ?? 'Pick a range'
  if (!range.to) return `${formatDate(range.from)} →`
  return `${formatDate(range.from)} → ${formatDate(range.to)}`
}

export const DateRangePicker = React.forwardRef<HTMLButtonElement, DateRangePickerProps>(
  (
    {
      className,
      value,
      onValueChange,
      label,
      error,
      helperText,
      placeholder = 'Pick a range',
      disabled,
      fromDate,
      toDate,
      id,
    },
    ref
  ) => {
    const generatedId = React.useId()
    const triggerId = id ?? generatedId
    const [open, setOpen] = React.useState(false)
    const triggerRef = React.useRef<HTMLButtonElement>(null)
    const popoverRef = React.useRef<HTMLDivElement>(null)

    React.useImperativeHandle(ref, () => triggerRef.current!)

    React.useEffect(() => {
      if (!open) return
      const handler = (e: MouseEvent) => {
        if (
          !triggerRef.current?.contains(e.target as Node) &&
          !popoverRef.current?.contains(e.target as Node)
        ) {
          setOpen(false)
        }
      }
      document.addEventListener('mousedown', handler)
      return () => document.removeEventListener('mousedown', handler)
    }, [open])

    const hasValue = Boolean(value?.from)

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
            disabled={disabled}
            onClick={() => setOpen(o => !o)}
            className={cn(
              'flex h-10 w-full items-center justify-start rounded-md border border-input bg-background px-md py-sm text-sm',
              'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              !hasValue && 'text-muted-foreground',
              error && 'border-destructive focus-visible:ring-destructive',
              className
            )}
          >
            <svg
              className="mr-sm h-4 w-4 shrink-0 text-muted-foreground"
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
            <span className="truncate">{formatTriggerLabel(value, placeholder)}</span>
          </button>
          {open && (
            <div
              ref={popoverRef}
              className="absolute z-50 mt-1 rounded-md border border-border bg-popover shadow-md"
            >
              <DayPicker
                mode="range"
                selected={toDayPickerRange(value)}
                onSelect={(range?: DayPickerRange) => {
                  onValueChange?.({
                    from: range?.from ?? null,
                    to: range?.to ?? null,
                  })
                }}
                numberOfMonths={2}
                disabled={fromDate || toDate
                  ? { before: fromDate, after: toDate }
                  : undefined}
                classNames={calendarClassNames}
              />
            </div>
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
DateRangePicker.displayName = 'DateRangePicker'
```

```ts
// src/components/date-range-picker/index.ts
export {
  DateRangePicker,
  type DateRange,
  type DateRangePickerProps,
} from './date-range-picker'
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm test -- --reporter=verbose src/components/date-range-picker/date-range-picker.test.tsx
```

Expected: all tests pass.

- [ ] **Step 5: Write Storybook story**

```tsx
// src/components/date-range-picker/date-range-picker.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { DateRangePicker, type DateRange } from './date-range-picker'

const meta: Meta<typeof DateRangePicker> = {
  title: 'Components/DateRangePicker',
  component: DateRangePicker,
}
export default meta

type Story = StoryObj<typeof DateRangePicker>

export const Default: Story = {}

export const WithLabel: Story = {
  args: { label: 'Date Range', placeholder: 'Select range' },
}

export const WithValue: Story = {
  args: {
    value: { from: new Date(2025, 5, 1), to: new Date(2025, 5, 15) },
    label: 'Date Range',
  },
}

export const WithError: Story = {
  args: { label: 'Date Range', error: 'Date range is required' },
}

export const Disabled: Story = {
  args: { label: 'Date Range', disabled: true },
}

export const Controlled: Story = {
  render: () => {
    const [range, setRange] = React.useState<DateRange>({ from: null, to: null })
    return (
      <DateRangePicker
        value={range}
        onValueChange={setRange}
        label="Select a date range"
        helperText={
          range.from && range.to
            ? `${range.from.toDateString()} → ${range.to.toDateString()}`
            : 'Pick start and end dates'
        }
      />
    )
  },
}
```

- [ ] **Step 6: Add exports to `src/index.ts`**

Append:

```ts
export {
  DateRangePicker,
  type DateRange,
  type DateRangePickerProps,
} from './components/date-range-picker'
```

- [ ] **Step 7: Run full test suite**

```bash
pnpm test:run
```

Expected: all tests pass.

- [ ] **Step 8: Commit**

```bash
git add src/components/date-range-picker/ src/index.ts
git commit -m "feat: DateRangePicker — react-day-picker@^9 range mode, two-month calendar"
```

---

## Self-Review

**Spec coverage:**
- Select: custom dropdown, ARIA combobox, keyboard nav, label/error/helperText — ✅
- Toast: imperative `toast()`, `ToastProvider` portal, variants, auto-dismiss — ✅
- Autocomplete: local filter + async onSearch, ARIA combobox, keyboard nav, clear button — ✅
- DatePicker: react-day-picker@^9 single, Tailwind classNames, label/error — ✅
- DateRangePicker: react-day-picker@^9 range, two-month, label/error — ✅
- `src/index.ts` updated after each task — ✅

**Placeholder scan:** No TBD, TODO, or incomplete sections. All code blocks are complete.

**Type consistency:**
- `SelectOption` ↔ `AutocompleteOption`: parallel shapes (label, value, disabled) — consistent naming.
- `DateRange` in DateRangePicker: `{ from: Date | null; to: Date | null }` — consistent with `DatePicker`'s `value?: Date | null`.
- `onValueChange` pattern consistent across all five components.

**Constraint check:**
- No arbitrary Tailwind values present.
- `react-day-picker` added to `dependencies`, not `devDependencies`.
- React/React-DOM remain peerDependencies only.
- `cn()` imported from `../../lib/utils` in all components.
- `displayName` set on all components.
- `forwardRef` used on all components.

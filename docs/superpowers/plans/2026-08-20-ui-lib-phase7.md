# UI Library Phase 7 — Atomic Components

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 6 atomic UI components — Avatar, Chip, Input, Checkbox, RadioGroup, Toggle — each following the established CVA + forwardRef pattern, with Vitest tests and Storybook stories.

**Architecture:** Each component lives in `src/components/{name}/` with a `.tsx` implementation, `index.ts` barrel, `{name}.test.tsx`, and `{name}.stories.tsx`. All exported from `src/index.ts`. Components use CVA for variant management, Tailwind semantic classes, and native HTML elements for accessibility. Checkbox and RadioGroupItem use a visually-hidden native input overlaid with a custom visual span for full style control while keeping native semantics.

**Tech Stack:** CVA (class-variance-authority), Tailwind CSS v3, Vitest + @testing-library/react, Storybook 8

**Spec:** Design approved in session — Avatar (src/fallback/size), Chip (label/variant/onClose), Input (label/error/helperText/adornments), Checkbox (checked/onCheckedChange/indeterminate/label), RadioGroup+RadioGroupItem (value/onValueChange via Context), Toggle (checked/onCheckedChange/label/size/role="switch")

## Global Constraints

- Package name: `@ui/ui-lib`
- Node ≥18, pnpm (not npm/yarn) for all installs
- React/React-DOM remain `peerDependencies` only — never add to `dependencies` or `devDependencies`
- All Tailwind classes stay semantic — no arbitrary values like `w-[120px]` or `bg-[#123]`; standard numeric classes (`h-8 w-8 pl-9`) are fine
- `dts: false` stays in `tsup.config.ts`
- `sideEffects: ["./dist/style.css"]` must stay in `package.json`
- Every task ends with a `git commit`
- Pattern: CVA + `React.forwardRef` + `cn()` + spread native HTML attrs + `displayName`
- `cn()` is at `src/lib/utils.ts` — import as `import { cn } from '../../lib/utils'`
- `React.useId()` is available (React 18, `@types/react@^19` installed)

---

### Task 1: Avatar

**Files:**
- Create: `src/components/avatar/avatar.tsx`
- Create: `src/components/avatar/index.ts`
- Create: `src/components/avatar/avatar.test.tsx`
- Create: `src/components/avatar/avatar.stories.tsx`
- Modify: `src/index.ts`

**Interfaces:**
- Produces: `Avatar`, `AvatarProps` exported from `@ui/ui-lib`
- Consumes: `cn` from `src/lib/utils.ts`, `cva`/`VariantProps` from `class-variance-authority`, React 18

- [ ] **Step 1: Write `src/components/avatar/avatar.tsx`**

```tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const avatarVariants = cva(
  'relative inline-flex shrink-0 overflow-hidden rounded-full bg-muted',
  {
    variants: {
      size: {
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
      },
    },
    defaultVariants: { size: 'md' },
  }
)

export interface AvatarProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof avatarVariants> {
  src?: string
  alt?: string
  fallback?: string
}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, size, src, alt, fallback, ...props }, ref) => {
    const [imgError, setImgError] = React.useState(false)
    const showImage = src && !imgError
    const initials = fallback?.slice(0, 2).toUpperCase() ?? '?'

    return (
      <span
        ref={ref}
        className={cn(avatarVariants({ size }), 'text-muted-foreground', className)}
        {...props}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt ?? ''}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center font-medium">
            {initials}
          </span>
        )}
      </span>
    )
  }
)
Avatar.displayName = 'Avatar'
```

- [ ] **Step 2: Write `src/components/avatar/index.ts`**

```ts
export { Avatar, type AvatarProps } from './avatar'
```

- [ ] **Step 3: Write `src/components/avatar/avatar.test.tsx`**

```tsx
import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Avatar } from './avatar'

describe('Avatar', () => {
  it('renders fallback initials when no src', () => {
    render(<Avatar fallback="PM" />)
    expect(screen.getByText('PM')).toBeInTheDocument()
  })

  it('truncates fallback to 2 uppercase chars', () => {
    render(<Avatar fallback="peter" />)
    expect(screen.getByText('PE')).toBeInTheDocument()
  })

  it('renders ? when no fallback and no src', () => {
    render(<Avatar />)
    expect(screen.getByText('?')).toBeInTheDocument()
  })

  it('renders image when src is provided', () => {
    render(<Avatar src="https://example.com/photo.jpg" alt="User photo" />)
    expect(screen.getByRole('img', { name: 'User photo' })).toBeInTheDocument()
  })

  it('applies sm size class', () => {
    const { container } = render(<Avatar size="sm" fallback="AB" />)
    expect(container.firstChild).toHaveClass('h-8', 'w-8')
  })

  it('applies lg size class', () => {
    const { container } = render(<Avatar size="lg" fallback="AB" />)
    expect(container.firstChild).toHaveClass('h-12', 'w-12')
  })

  it('merges custom className', () => {
    const { container } = render(<Avatar fallback="AB" className="ring-2" />)
    expect(container.firstChild).toHaveClass('ring-2')
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLSpanElement>()
    render(<Avatar ref={ref} fallback="AB" />)
    expect(ref.current?.tagName).toBe('SPAN')
  })
})
```

- [ ] **Step 4: Write `src/components/avatar/avatar.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from './avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
}

export default meta
type Story = StoryObj<typeof Avatar>

export const WithImage: Story = {
  args: { src: 'https://github.com/shadcn.png', alt: 'Avatar', size: 'md' },
}

export const WithFallback: Story = {
  args: { fallback: 'PM', size: 'md' },
}

export const Small: Story = {
  args: { fallback: 'PM', size: 'sm' },
}

export const Large: Story = {
  args: { fallback: 'PM', size: 'lg' },
}
```

- [ ] **Step 5: Add export to `src/index.ts`**

Read `src/index.ts` first. Append:
```ts
export { Avatar, type AvatarProps } from './components/avatar'
```

- [ ] **Step 6: Run tests**

```bash
pnpm test:run
```

Expected: Button 10 + Avatar 8 = 18 tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/components/avatar/ src/index.ts
git commit -m "feat: Avatar component with image/fallback and size variants (Phase 7)"
```

---

### Task 2: Chip

**Files:**
- Create: `src/components/chip/chip.tsx`
- Create: `src/components/chip/index.ts`
- Create: `src/components/chip/chip.test.tsx`
- Create: `src/components/chip/chip.stories.tsx`
- Modify: `src/index.ts`

**Interfaces:**
- Produces: `Chip`, `ChipProps`, `chipVariants` exported from `@ui/ui-lib`
- Consumes: `cn` from `src/lib/utils.ts`, `cva`/`VariantProps` from `class-variance-authority`

- [ ] **Step 1: Write `src/components/chip/chip.tsx`**

```tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

export const chipVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-sm py-0.5 text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
        outline: 'border-border bg-background text-foreground',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface ChipProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof chipVariants> {
  label: string
  onClose?: () => void
}

export const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(
  ({ className, variant, label, onClose, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(chipVariants({ variant }), className)}
      {...props}
    >
      {label}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="ml-0.5 inline-flex items-center justify-center rounded-full p-0.5 opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          aria-label={`Remove ${label}`}
        >
          <svg
            className="h-3 w-3"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M2 2l8 8M10 2l-8 8" />
          </svg>
        </button>
      )}
    </span>
  )
)
Chip.displayName = 'Chip'
```

- [ ] **Step 2: Write `src/components/chip/index.ts`**

```ts
export { Chip, chipVariants, type ChipProps } from './chip'
```

- [ ] **Step 3: Write `src/components/chip/chip.test.tsx`**

```tsx
import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Chip } from './chip'

describe('Chip', () => {
  it('renders label text', () => {
    render(<Chip label="React" />)
    expect(screen.getByText('React')).toBeInTheDocument()
  })

  it('applies default variant classes', () => {
    const { container } = render(<Chip label="Tag" />)
    expect(container.firstChild).toHaveClass('bg-primary')
  })

  it('applies secondary variant', () => {
    const { container } = render(<Chip label="Tag" variant="secondary" />)
    expect(container.firstChild).toHaveClass('bg-secondary')
  })

  it('applies destructive variant', () => {
    const { container } = render(<Chip label="Error" variant="destructive" />)
    expect(container.firstChild).toHaveClass('bg-destructive')
  })

  it('applies outline variant', () => {
    const { container } = render(<Chip label="Tag" variant="outline" />)
    expect(container.firstChild).toHaveClass('border-border')
  })

  it('renders close button when onClose provided', () => {
    render(<Chip label="React" onClose={() => {}} />)
    expect(screen.getByRole('button', { name: 'Remove React' })).toBeInTheDocument()
  })

  it('does not render close button when onClose absent', () => {
    render(<Chip label="React" />)
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('calls onClose when close button clicked', async () => {
    const handleClose = vi.fn()
    render(<Chip label="React" onClose={handleClose} />)
    await userEvent.click(screen.getByRole('button', { name: 'Remove React' }))
    expect(handleClose).toHaveBeenCalledOnce()
  })

  it('merges custom className', () => {
    const { container } = render(<Chip label="Tag" className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
```

- [ ] **Step 4: Write `src/components/chip/chip.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Chip } from './chip'

const meta: Meta<typeof Chip> = {
  title: 'Components/Chip',
  component: Chip,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'secondary', 'destructive', 'outline'] },
  },
}

export default meta
type Story = StoryObj<typeof Chip>

export const Default: Story = { args: { label: 'React', variant: 'default' } }
export const Secondary: Story = { args: { label: 'TypeScript', variant: 'secondary' } }
export const Destructive: Story = { args: { label: 'Error', variant: 'destructive' } }
export const Outline: Story = { args: { label: 'Tag', variant: 'outline' } }
export const WithClose: Story = { args: { label: 'Closeable', onClose: () => {} } }
```

- [ ] **Step 5: Add export to `src/index.ts`**

Read `src/index.ts` first. Append:
```ts
export { Chip, chipVariants, type ChipProps } from './components/chip'
```

- [ ] **Step 6: Run tests**

```bash
pnpm test:run
```

Expected: prior 18 + Chip 9 = 27 tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/components/chip/ src/index.ts
git commit -m "feat: Chip component with variants and optional close button (Phase 7)"
```

---

### Task 3: Input

**Files:**
- Create: `src/components/input/input.tsx`
- Create: `src/components/input/index.ts`
- Create: `src/components/input/input.test.tsx`
- Create: `src/components/input/input.stories.tsx`
- Modify: `src/index.ts`

**Interfaces:**
- Produces: `Input`, `InputProps` exported from `@ui/ui-lib`
- Consumes: `cn` from `src/lib/utils.ts`, React 18 (`useId`)

- [ ] **Step 1: Write `src/components/input/input.tsx`**

`pl-9`/`pr-9` are standard Tailwind numeric classes (2.25rem padding), not arbitrary values — used to prevent text overlap with adornment icons.

```tsx
import * as React from 'react'
import { cn } from '../../lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, startAdornment, endAdornment, id, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id ?? generatedId

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {startAdornment && (
            <span className="pointer-events-none absolute left-md flex items-center text-muted-foreground">
              {startAdornment}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-background px-md py-sm text-sm text-foreground',
              'placeholder:text-muted-foreground',
              'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              startAdornment && 'pl-9',
              endAdornment && 'pr-9',
              error && 'border-destructive focus-visible:ring-destructive',
              className
            )}
            {...props}
          />
          {endAdornment && (
            <span className="pointer-events-none absolute right-md flex items-center text-muted-foreground">
              {endAdornment}
            </span>
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
Input.displayName = 'Input'
```

- [ ] **Step 2: Write `src/components/input/index.ts`**

```ts
export { Input, type InputProps } from './input'
```

- [ ] **Step 3: Write `src/components/input/input.test.tsx`**

```tsx
import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { Input } from './input'

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders label linked to input', () => {
    render(<Input label="Email" />)
    expect(screen.getByRole('textbox')).toHaveAccessibleName('Email')
  })

  it('renders error message with role=alert', () => {
    render(<Input error="Required field" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Required field')
  })

  it('applies error border class when error present', () => {
    render(<Input error="Invalid" />)
    expect(screen.getByRole('textbox')).toHaveClass('border-destructive')
  })

  it('renders helper text when no error', () => {
    render(<Input helperText="Enter your email" />)
    expect(screen.getByText('Enter your email')).toBeInTheDocument()
  })

  it('hides helper text when error is present', () => {
    render(<Input error="Error msg" helperText="Helper msg" />)
    expect(screen.queryByText('Helper msg')).toBeNull()
  })

  it('renders startAdornment', () => {
    render(<Input startAdornment={<span data-testid="start" />} />)
    expect(screen.getByTestId('start')).toBeInTheDocument()
  })

  it('renders endAdornment', () => {
    render(<Input endAdornment={<span data-testid="end" />} />)
    expect(screen.getByTestId('end')).toBeInTheDocument()
  })

  it('applies pl-9 when startAdornment present', () => {
    render(<Input startAdornment={<span />} />)
    expect(screen.getByRole('textbox')).toHaveClass('pl-9')
  })

  it('accepts typed input', async () => {
    render(<Input />)
    await userEvent.type(screen.getByRole('textbox'), 'hello')
    expect(screen.getByRole('textbox')).toHaveValue('hello')
  })

  it('is disabled when disabled prop is set', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<Input ref={ref} />)
    expect(ref.current?.tagName).toBe('INPUT')
  })
})
```

- [ ] **Step 4: Write `src/components/input/input.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './input'

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: { placeholder: 'Enter text...' },
}

export const WithLabel: Story = {
  args: { label: 'Email', placeholder: 'you@example.com' },
}

export const WithError: Story = {
  args: { label: 'Email', defaultValue: 'invalid', error: 'Please enter a valid email address' },
}

export const WithHelperText: Story = {
  args: { label: 'Password', type: 'password', helperText: 'Must be at least 8 characters' },
}

export const Disabled: Story = {
  args: { label: 'Disabled', defaultValue: 'Cannot edit', disabled: true },
}
```

- [ ] **Step 5: Add export to `src/index.ts`**

Read `src/index.ts` first. Append:
```ts
export { Input, type InputProps } from './components/input'
```

- [ ] **Step 6: Run tests**

```bash
pnpm test:run
```

Expected: prior 27 + Input 12 = 39 tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/components/input/ src/index.ts
git commit -m "feat: Input component with label, error, helper text, and adornments (Phase 7)"
```

---

### Task 4: Checkbox

**Files:**
- Create: `src/components/checkbox/checkbox.tsx`
- Create: `src/components/checkbox/index.ts`
- Create: `src/components/checkbox/checkbox.test.tsx`
- Create: `src/components/checkbox/checkbox.stories.tsx`
- Modify: `src/index.ts`

**Interfaces:**
- Produces: `Checkbox`, `CheckboxProps` exported from `@ui/ui-lib`
- Consumes: `cn` from `src/lib/utils.ts`, React 18 (`useId`, `useRef`, `useEffect`, `useImperativeHandle`)

- [ ] **Step 1: Write `src/components/checkbox/checkbox.tsx`**

Uses a visually-hidden native `<input type="checkbox">` overlaid on a custom visual box. Native input handles focus, keyboard, and screen-reader semantics; the visual box provides custom styling.

```tsx
import * as React from 'react'
import { cn } from '../../lib/utils'

export interface CheckboxProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: string
  indeterminate?: boolean
  disabled?: boolean
  id?: string
  className?: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, label, indeterminate, disabled, id }, ref) => {
    const generatedId = React.useId()
    const inputId = id ?? generatedId
    const innerRef = React.useRef<HTMLInputElement>(null)

    React.useImperativeHandle(ref, () => innerRef.current!)

    React.useEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = indeterminate ?? false
      }
    }, [indeterminate])

    return (
      <div className={cn('flex items-center gap-sm', className)}>
        <div className="relative h-4 w-4 shrink-0">
          <input
            ref={innerRef}
            id={inputId}
            type="checkbox"
            checked={checked}
            onChange={(e) => onCheckedChange?.(e.target.checked)}
            disabled={disabled}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          />
          <div
            className={cn(
              'pointer-events-none h-4 w-4 rounded border border-input bg-background',
              'flex items-center justify-center transition-colors',
              (checked || indeterminate) && 'border-primary bg-primary',
              disabled && 'opacity-50',
            )}
          >
            {checked && !indeterminate && (
              <svg
                className="h-3 w-3 text-primary-foreground"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 6l3 3 5-5" />
              </svg>
            )}
            {indeterminate && (
              <svg
                className="h-3 w-3 text-primary-foreground"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M2.5 6h7" />
              </svg>
            )}
          </div>
        </div>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'text-sm text-foreground cursor-pointer select-none',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            {label}
          </label>
        )}
      </div>
    )
  }
)
Checkbox.displayName = 'Checkbox'
```

- [ ] **Step 2: Write `src/components/checkbox/index.ts`**

```ts
export { Checkbox, type CheckboxProps } from './checkbox'
```

- [ ] **Step 3: Write `src/components/checkbox/checkbox.test.tsx`**

```tsx
import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Checkbox } from './checkbox'

describe('Checkbox', () => {
  it('renders a checkbox input', () => {
    render(<Checkbox />)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('renders label linked to input', () => {
    render(<Checkbox label="Accept terms" />)
    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toBeInTheDocument()
  })

  it('reflects checked state', () => {
    render(<Checkbox checked={true} onCheckedChange={() => {}} label="Check me" />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('reflects unchecked state', () => {
    render(<Checkbox checked={false} onCheckedChange={() => {}} label="Check me" />)
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('calls onCheckedChange with true when unchecked box is clicked', async () => {
    const handleChange = vi.fn()
    render(<Checkbox checked={false} onCheckedChange={handleChange} label="Check" />)
    await userEvent.click(screen.getByRole('checkbox'))
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('is disabled when disabled prop is set', () => {
    render(<Checkbox disabled label="Disabled" />)
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })

  it('sets indeterminate on native input', () => {
    const { rerender } = render(<Checkbox indeterminate={false} label="Check" />)
    rerender(<Checkbox indeterminate={true} label="Check" />)
    expect(screen.getByRole('checkbox')).toHaveProperty('indeterminate', true)
  })

  it('forwards ref to native input element', () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<Checkbox ref={ref} label="Check" />)
    expect(ref.current?.type).toBe('checkbox')
  })
})
```

- [ ] **Step 4: Write `src/components/checkbox/checkbox.stories.tsx`**

```tsx
import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from './checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const Unchecked: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(false)
    return <Checkbox checked={checked} onCheckedChange={setChecked} label="Accept terms and conditions" />
  },
}

export const Checked: Story = {
  args: { checked: true, label: 'Selected option' },
}

export const Indeterminate: Story = {
  args: { indeterminate: true, label: 'Partial selection' },
}

export const Disabled: Story = {
  args: { disabled: true, label: 'Cannot change this' },
}
```

- [ ] **Step 5: Add export to `src/index.ts`**

Read `src/index.ts` first. Append:
```ts
export { Checkbox, type CheckboxProps } from './components/checkbox'
```

- [ ] **Step 6: Run tests**

```bash
pnpm test:run
```

Expected: prior 39 + Checkbox 8 = 47 tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/components/checkbox/ src/index.ts
git commit -m "feat: Checkbox with custom visual, indeterminate, and ref forwarding (Phase 7)"
```

---

### Task 5: RadioGroup

**Files:**
- Create: `src/components/radio-group/radio-group.tsx`
- Create: `src/components/radio-group/index.ts`
- Create: `src/components/radio-group/radio-group.test.tsx`
- Create: `src/components/radio-group/radio-group.stories.tsx`
- Modify: `src/index.ts`

**Interfaces:**
- Produces: `RadioGroup`, `RadioGroupItem`, `RadioGroupProps`, `RadioGroupItemProps` exported from `@ui/ui-lib`
- Consumes: `cn` from `src/lib/utils.ts`, React 18 (`createContext`, `useContext`, `useId`)

- [ ] **Step 1: Write `src/components/radio-group/radio-group.tsx`**

`RadioGroupItem` used outside a `RadioGroup` will silently no-op on selection — this is acceptable, the Context pattern implies composition.

```tsx
import * as React from 'react'
import { cn } from '../../lib/utils'

interface RadioGroupContextValue {
  value: string
  onValueChange: (value: string) => void
  name: string
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null)

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  onValueChange: (value: string) => void
  name?: string
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, onValueChange, name, children, ...props }, ref) => {
    const generatedName = React.useId()
    return (
      <RadioGroupContext.Provider value={{ value, onValueChange, name: name ?? generatedName }}>
        <div
          ref={ref}
          role="radiogroup"
          className={cn('flex flex-col gap-sm', className)}
          {...props}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    )
  }
)
RadioGroup.displayName = 'RadioGroup'

export interface RadioGroupItemProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'checked' | 'onChange' | 'name'> {
  value: string
  label?: string
}

export const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, label, id, disabled, ...props }, ref) => {
    const ctx = React.useContext(RadioGroupContext)
    const generatedId = React.useId()
    const inputId = id ?? generatedId
    const isChecked = ctx?.value === value

    return (
      <div className={cn('flex items-center gap-sm', className)}>
        <div className="relative h-4 w-4 shrink-0">
          <input
            ref={ref}
            id={inputId}
            type="radio"
            name={ctx?.name}
            value={value}
            checked={isChecked}
            onChange={() => ctx?.onValueChange(value)}
            disabled={disabled}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
            {...props}
          />
          <div
            className={cn(
              'pointer-events-none h-4 w-4 rounded-full border border-input bg-background',
              'flex items-center justify-center transition-colors',
              isChecked && 'border-primary',
              disabled && 'opacity-50',
            )}
          >
            {isChecked && <div className="h-2 w-2 rounded-full bg-primary" />}
          </div>
        </div>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'text-sm text-foreground cursor-pointer select-none',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            {label}
          </label>
        )}
      </div>
    )
  }
)
RadioGroupItem.displayName = 'RadioGroupItem'
```

- [ ] **Step 2: Write `src/components/radio-group/index.ts`**

```ts
export {
  RadioGroup,
  RadioGroupItem,
  type RadioGroupProps,
  type RadioGroupItemProps,
} from './radio-group'
```

- [ ] **Step 3: Write `src/components/radio-group/radio-group.test.tsx`**

```tsx
import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { RadioGroup, RadioGroupItem } from './radio-group'

describe('RadioGroup', () => {
  const renderGroup = (value = 'a', onValueChange = vi.fn()) =>
    render(
      <RadioGroup value={value} onValueChange={onValueChange}>
        <RadioGroupItem value="a" label="Option A" />
        <RadioGroupItem value="b" label="Option B" />
        <RadioGroupItem value="c" label="Option C" />
      </RadioGroup>
    )

  it('renders all radio items', () => {
    renderGroup()
    expect(screen.getAllByRole('radio')).toHaveLength(3)
  })

  it('checks the item matching current value', () => {
    renderGroup('b')
    expect(screen.getByRole('radio', { name: 'Option B' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Option A' })).not.toBeChecked()
  })

  it('calls onValueChange with the new value when an item is clicked', async () => {
    const handleChange = vi.fn()
    renderGroup('a', handleChange)
    await userEvent.click(screen.getByRole('radio', { name: 'Option B' }))
    expect(handleChange).toHaveBeenCalledWith('b')
  })

  it('all items share the same name attribute', () => {
    renderGroup()
    const radios = screen.getAllByRole('radio') as HTMLInputElement[]
    const names = radios.map((r) => r.name)
    expect(new Set(names).size).toBe(1)
  })

  it('renders labels linked to each radio', () => {
    renderGroup()
    expect(screen.getByRole('radio', { name: 'Option A' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Option C' })).toBeInTheDocument()
  })

  it('disables individual items', () => {
    render(
      <RadioGroup value="a" onValueChange={() => {}}>
        <RadioGroupItem value="a" label="A" />
        <RadioGroupItem value="b" label="B" disabled />
      </RadioGroup>
    )
    expect(screen.getByRole('radio', { name: 'B' })).toBeDisabled()
    expect(screen.getByRole('radio', { name: 'A' })).not.toBeDisabled()
  })
})
```

- [ ] **Step 4: Write `src/components/radio-group/radio-group.stories.tsx`**

```tsx
import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { RadioGroup, RadioGroupItem } from './radio-group'

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState('option1')
    return (
      <RadioGroup value={value} onValueChange={setValue}>
        <RadioGroupItem value="option1" label="Option 1" />
        <RadioGroupItem value="option2" label="Option 2" />
        <RadioGroupItem value="option3" label="Option 3" />
      </RadioGroup>
    )
  },
}

export const WithDisabledItem: Story = {
  render: () => {
    const [value, setValue] = React.useState('option1')
    return (
      <RadioGroup value={value} onValueChange={setValue}>
        <RadioGroupItem value="option1" label="Available" />
        <RadioGroupItem value="option2" label="Unavailable (disabled)" disabled />
        <RadioGroupItem value="option3" label="Also available" />
      </RadioGroup>
    )
  },
}
```

- [ ] **Step 5: Add export to `src/index.ts`**

Read `src/index.ts` first. Append:
```ts
export {
  RadioGroup,
  RadioGroupItem,
  type RadioGroupProps,
  type RadioGroupItemProps,
} from './components/radio-group'
```

- [ ] **Step 6: Run tests**

```bash
pnpm test:run
```

Expected: prior 47 + RadioGroup 6 = 53 tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/components/radio-group/ src/index.ts
git commit -m "feat: RadioGroup + RadioGroupItem with Context-based value management (Phase 7)"
```

---

### Task 6: Toggle

**Files:**
- Create: `src/components/toggle/toggle.tsx`
- Create: `src/components/toggle/index.ts`
- Create: `src/components/toggle/toggle.test.tsx`
- Create: `src/components/toggle/toggle.stories.tsx`
- Modify: `src/index.ts`

**Interfaces:**
- Produces: `Toggle`, `ToggleProps` exported from `@ui/ui-lib`
- Consumes: `cn` from `src/lib/utils.ts`, React 18 (`useId`)

- [ ] **Step 1: Write `src/components/toggle/toggle.tsx`**

`translate-x-4` (sm checked) and `translate-x-5` (md checked) are standard Tailwind classes. Label's `onClick` directly calls `onCheckedChange` to avoid double-firing — a `<label>` does not natively activate a `<button>`.

```tsx
import * as React from 'react'
import { cn } from '../../lib/utils'

export interface ToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label?: string
  size?: 'sm' | 'md'
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, checked, onCheckedChange, label, size = 'md', disabled, id, ...props }, ref) => {
    const generatedId = React.useId()
    const buttonId = id ?? generatedId

    return (
      <div className="flex items-center gap-sm">
        <button
          ref={ref}
          id={buttonId}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => onCheckedChange(!checked)}
          className={cn(
            'relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent',
            'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            size === 'sm' ? 'h-5 w-9' : 'h-6 w-11',
            checked ? 'bg-primary' : 'bg-input',
            className
          )}
          {...props}
        >
          <span
            className={cn(
              'pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform',
              size === 'sm' ? 'h-4 w-4' : 'h-5 w-5',
              size === 'sm'
                ? checked ? 'translate-x-4' : 'translate-x-0'
                : checked ? 'translate-x-5' : 'translate-x-0'
            )}
          />
        </button>
        {label && (
          <label
            htmlFor={buttonId}
            className={cn(
              'text-sm text-foreground cursor-pointer select-none',
              disabled && 'cursor-not-allowed opacity-50'
            )}
            onClick={() => !disabled && onCheckedChange(!checked)}
          >
            {label}
          </label>
        )}
      </div>
    )
  }
)
Toggle.displayName = 'Toggle'
```

- [ ] **Step 2: Write `src/components/toggle/index.ts`**

```ts
export { Toggle, type ToggleProps } from './toggle'
```

- [ ] **Step 3: Write `src/components/toggle/toggle.test.tsx`**

```tsx
import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Toggle } from './toggle'

describe('Toggle', () => {
  it('renders a switch button', () => {
    render(<Toggle checked={false} onCheckedChange={() => {}} />)
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('has aria-checked=false when unchecked', () => {
    render(<Toggle checked={false} onCheckedChange={() => {}} />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')
  })

  it('has aria-checked=true when checked', () => {
    render(<Toggle checked={true} onCheckedChange={() => {}} />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('calls onCheckedChange with true when off toggle is clicked', async () => {
    const handleChange = vi.fn()
    render(<Toggle checked={false} onCheckedChange={handleChange} />)
    await userEvent.click(screen.getByRole('switch'))
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('calls onCheckedChange with false when on toggle is clicked', async () => {
    const handleChange = vi.fn()
    render(<Toggle checked={true} onCheckedChange={handleChange} />)
    await userEvent.click(screen.getByRole('switch'))
    expect(handleChange).toHaveBeenCalledWith(false)
  })

  it('is disabled when disabled prop is set', () => {
    render(<Toggle checked={false} onCheckedChange={() => {}} disabled />)
    expect(screen.getByRole('switch')).toBeDisabled()
  })

  it('renders label text', () => {
    render(<Toggle checked={false} onCheckedChange={() => {}} label="Enable notifications" />)
    expect(screen.getByText('Enable notifications')).toBeInTheDocument()
  })

  it('applies sm size classes', () => {
    render(<Toggle checked={false} onCheckedChange={() => {}} size="sm" />)
    expect(screen.getByRole('switch')).toHaveClass('h-5', 'w-9')
  })

  it('applies md size classes by default', () => {
    render(<Toggle checked={false} onCheckedChange={() => {}} />)
    expect(screen.getByRole('switch')).toHaveClass('h-6', 'w-11')
  })

  it('applies bg-primary when checked', () => {
    render(<Toggle checked={true} onCheckedChange={() => {}} />)
    expect(screen.getByRole('switch')).toHaveClass('bg-primary')
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Toggle ref={ref} checked={false} onCheckedChange={() => {}} />)
    expect(ref.current?.tagName).toBe('BUTTON')
  })
})
```

- [ ] **Step 4: Write `src/components/toggle/toggle.stories.tsx`**

```tsx
import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Toggle } from './toggle'

const meta: Meta<typeof Toggle> = {
  title: 'Components/Toggle',
  component: Toggle,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md'] },
  },
}

export default meta
type Story = StoryObj<typeof Toggle>

export const Off: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(false)
    return <Toggle checked={checked} onCheckedChange={setChecked} label="Enable notifications" />
  },
}

export const On: Story = {
  args: { checked: true, label: 'Dark mode' },
}

export const SmallSize: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(true)
    return <Toggle checked={checked} onCheckedChange={setChecked} label="Small toggle" size="sm" />
  },
}

export const Disabled: Story = {
  args: { checked: false, disabled: true, label: 'Cannot change' },
}
```

- [ ] **Step 5: Add export to `src/index.ts`**

Read `src/index.ts` first. Append:
```ts
export { Toggle, type ToggleProps } from './components/toggle'
```

- [ ] **Step 6: Run full test suite**

```bash
pnpm test:run
```

Expected: all 64 tests pass (Button 10 + Avatar 8 + Chip 9 + Input 12 + Checkbox 8 + RadioGroup 6 + Toggle 11).

- [ ] **Step 7: Run build**

```bash
pnpm build
```

Expected: exits with no errors. `dist/` contains `index.js`, `index.mjs`, `index.d.ts`, `tailwind-preset.js`, `tailwind-preset.mjs`, `tailwind-preset.d.ts`, `style.css`.

- [ ] **Step 8: Commit**

```bash
git add src/components/toggle/ src/index.ts
git commit -m "feat: Toggle (switch) component with sm/md sizes and role=switch (Phase 7)"
```

---

## Pre-flight Scan

| Row | Tasks | Shared surface | Finding |
|---|---|---|---|
| T1 | T4 Checkbox | `useImperativeHandle` + `innerRef` | `innerRef.current!` non-null assertion is safe — the ref is only exposed after mount. No conflict. |
| T2 | T5 RadioGroup | `RadioGroupContext` is `null` outside provider | `RadioGroupItem` used without a wrapping `RadioGroup` silently no-ops on selection. Acceptable by design — same pattern as most React Context-based component APIs. |
| T3 | T1–T6 | `src/index.ts` | Each task appends one export line. Tasks are sequential (each commits before the next starts), so no conflict. |
| T4 | T3 Input | `pl-9` / `pr-9` | Standard Tailwind numeric utility classes (2.25rem). Not arbitrary values. Constraint satisfied. |
| T5 | T6 Toggle | Label `onClick` fires `onCheckedChange` directly | A `<label>` does not natively activate `<button>` elements, so clicking the label would otherwise do nothing. Direct call is correct. |
| T6 | All | `React.useId()` | Requires React 18+. `@types/react@^19` and `react@>=18` peerDep are in place — no API gap. |

Scan clean. No rulings needed before dispatch.

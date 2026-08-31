import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Button } from './button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('applies default variant classes', () => {
    render(<Button>Default</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toHaveClass('bg-primary')
    expect(btn).toHaveClass('text-primary-foreground')
  })

  it('applies outline variant classes', () => {
    render(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole('button')).toHaveClass('border')
  })

  it('applies ghost variant classes', () => {
    render(<Button variant="ghost">Ghost</Button>)
    expect(screen.getByRole('button')).not.toHaveClass('bg-primary')
  })

  it('applies sm size class', () => {
    render(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-9')
  })

  it('applies lg size class', () => {
    render(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-11')
  })

  it('calls onClick handler', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('applies destructive variant classes', () => {
    render(<Button variant="destructive">Delete</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-destructive')
  })

  it('shows a spinner and disables the button when loading', () => {
    render(<Button loading>Save</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    expect(btn).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByText('Save')).toBeInTheDocument()
  })

  it('is disabled when loading even if disabled=false is passed', () => {
    render(
      <Button loading disabled={false}>
        Save
      </Button>
    )
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('renders the child element instead of a button when asChild is set', () => {
    render(
      <Button asChild>
        <a href="/somewhere">Go</a>
      </Button>
    )
    const link = screen.getByRole('link', { name: 'Go' })
    expect(link).toBeInTheDocument()
    expect(link.tagName).toBe('A')
    expect(link).toHaveClass('bg-primary')
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('forwards ref to the child element when asChild is set', () => {
    const ref = React.createRef<HTMLAnchorElement>()
    render(
      <Button asChild ref={ref as unknown as React.Ref<HTMLButtonElement>}>
        <a href="/somewhere">Go</a>
      </Button>
    )
    expect(ref.current?.tagName).toBe('A')
  })

  it('merges custom className', () => {
    render(<Button className="extra-class">Custom</Button>)
    expect(screen.getByRole('button')).toHaveClass('extra-class')
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Ref</Button>)
    expect(ref.current).not.toBeNull()
    expect(ref.current?.tagName).toBe('BUTTON')
  })
})

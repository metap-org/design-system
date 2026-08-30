import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { IconButton } from './icon-button'

const Icon = () => (
  <svg data-testid="icon" viewBox="0 0 24 24">
    <path d="M0 0h24v24H0z" />
  </svg>
)

describe('IconButton', () => {
  it('renders the icon', () => {
    render(<IconButton icon={<Icon />} aria-label="Close" />)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('exposes the accessible name from aria-label', () => {
    render(<IconButton icon={<Icon />} aria-label="Close" />)
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })

  it('applies default size square classes', () => {
    render(<IconButton icon={<Icon />} aria-label="Close" />)
    const btn = screen.getByRole('button')
    expect(btn).toHaveClass('h-10')
    expect(btn).toHaveClass('w-10')
  })

  it('applies sm size square classes', () => {
    render(<IconButton icon={<Icon />} aria-label="Close" size="sm" />)
    const btn = screen.getByRole('button')
    expect(btn).toHaveClass('h-9')
    expect(btn).toHaveClass('w-9')
  })

  it('applies lg size square classes', () => {
    render(<IconButton icon={<Icon />} aria-label="Close" size="lg" />)
    const btn = screen.getByRole('button')
    expect(btn).toHaveClass('h-11')
    expect(btn).toHaveClass('w-11')
  })

  it('applies outline variant classes', () => {
    render(<IconButton icon={<Icon />} aria-label="Close" variant="outline" />)
    expect(screen.getByRole('button')).toHaveClass('border')
  })

  it('has no horizontal button padding (icon-only, square)', () => {
    render(<IconButton icon={<Icon />} aria-label="Close" />)
    const btn = screen.getByRole('button')
    expect(btn.className).not.toMatch(/(^|\s)px-/)
  })

  it('calls onClick handler', async () => {
    const handleClick = vi.fn()
    render(<IconButton icon={<Icon />} aria-label="Close" onClick={handleClick} />)
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('is disabled when disabled prop is set', () => {
    render(<IconButton icon={<Icon />} aria-label="Close" disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<IconButton ref={ref} icon={<Icon />} aria-label="Close" />)
    expect(ref.current?.tagName).toBe('BUTTON')
  })
})

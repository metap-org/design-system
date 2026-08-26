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

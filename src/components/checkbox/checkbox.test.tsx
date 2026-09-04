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

  it('accepts an aria-label when there is no visible label', () => {
    render(<Checkbox aria-label="Select row" />)
    expect(screen.getByRole('checkbox', { name: 'Select row' })).toBeInTheDocument()
  })

  it('prefers the visible label over aria-label when both are given', () => {
    render(<Checkbox label="Accept terms" aria-label="ignored" />)
    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toBeInTheDocument()
  })

  it('forwards ref to native input element', () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<Checkbox ref={ref} label="Check" />)
    expect(ref.current?.type).toBe('checkbox')
  })
})

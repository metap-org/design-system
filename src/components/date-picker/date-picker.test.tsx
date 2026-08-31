import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { DatePicker } from './date-picker'

describe('DatePicker', () => {
  it('renders placeholder when no value is set', () => {
    render(<DatePicker placeholder="Pick a date" />)
    expect(screen.getByText('Pick a date')).toBeInTheDocument()
  })

  it('renders formatted date when a value is set', () => {
    render(<DatePicker value={new Date(2026, 0, 15)} />)
    expect(screen.getByRole('button').textContent).toContain('2026')
    expect(screen.getByRole('button').textContent).toContain('15')
  })

  it('opens the calendar dialog on click', async () => {
    render(<DatePicker />)
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('dialog', { name: /date picker/i })).toBeInTheDocument()
  })

  it('closes the calendar when clicking outside', async () => {
    render(
      <div>
        <DatePicker />
        <button>Outside</button>
      </div>
    )
    await userEvent.click(screen.getByRole('button', { name: /pick a date/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Outside' }))
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('calls onValueChange with the picked date', async () => {
    const handleChange = vi.fn()
    render(<DatePicker onValueChange={handleChange} />)
    await userEvent.click(screen.getByRole('button'))
    const dayButtons = screen.getAllByRole('gridcell')
    const firstDay = dayButtons.find(cell => cell.querySelector('button:not([disabled])'))
    const button = firstDay?.querySelector('button')
    expect(button).toBeTruthy()
    await userEvent.click(button!)
    expect(handleChange).toHaveBeenCalled()
    const picked = handleChange.mock.calls[0][0] as Date
    expect(picked).toBeInstanceOf(Date)
  })

  it('shows error message with role="alert"', () => {
    render(<DatePicker error="Required" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Required')
  })

  it('shows helper text when no error', () => {
    render(<DatePicker helperText="Choose a date" />)
    expect(screen.getByText('Choose a date')).toBeInTheDocument()
  })

  it('is disabled when disabled prop is set', () => {
    render(<DatePicker disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('renders label associated with the trigger button', () => {
    render(<DatePicker label="Date of birth" />)
    expect(screen.getByText('Date of birth')).toBeInTheDocument()
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<DatePicker ref={ref} />)
    expect(ref.current?.tagName).toBe('BUTTON')
  })
})

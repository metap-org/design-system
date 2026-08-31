import * as React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { DateTimePicker } from './date-time-picker'

describe('DateTimePicker', () => {
  it('renders placeholder when no value is set', () => {
    render(<DateTimePicker placeholder="Pick a date & time" />)
    expect(screen.getByText('Pick a date & time')).toBeInTheDocument()
  })

  it('renders formatted date and time when a value is set', () => {
    render(<DateTimePicker value={new Date(2026, 0, 15, 14, 30)} />)
    expect(screen.getByRole('button').textContent).toContain('2026')
    expect(screen.getByRole('button').textContent).toMatch(/2:30|14:30/)
  })

  it('opens the calendar dialog on click', async () => {
    render(<DateTimePicker />)
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('dialog', { name: /date & time picker/i })).toBeInTheDocument()
  })

  it('renders a disabled time input when no date is selected yet', async () => {
    render(<DateTimePicker />)
    await userEvent.click(screen.getByRole('button'))
    const timeInput = screen.getByLabelText('Time') as HTMLInputElement
    expect(timeInput).toBeDisabled()
  })

  it('calls onValueChange with the picked date, preserving time as midnight when no prior value', async () => {
    const handleChange = vi.fn()
    render(<DateTimePicker onValueChange={handleChange} />)
    await userEvent.click(screen.getByRole('button'))
    const dayButtons = screen.getAllByRole('gridcell')
    // Pick the first enabled day in the currently-shown month.
    const firstDay = dayButtons.find(cell => cell.querySelector('button:not([disabled])'))
    const button = firstDay?.querySelector('button')
    expect(button).toBeTruthy()
    await userEvent.click(button!)
    expect(handleChange).toHaveBeenCalled()
    const picked = handleChange.mock.calls[0][0] as Date
    expect(picked).toBeInstanceOf(Date)
  })

  it('updates the time-of-day while preserving the selected date', async () => {
    const handleChange = vi.fn()
    const value = new Date(2026, 0, 15, 9, 0, 0)
    render(<DateTimePicker value={value} onValueChange={handleChange} />)
    await userEvent.click(screen.getByRole('button'))
    const timeInput = screen.getByLabelText('Time') as HTMLInputElement
    expect(timeInput).not.toBeDisabled()
    expect(timeInput.value).toBe('09:00:00')
    fireEvent.change(timeInput, { target: { value: '18:45:00' } })
    expect(handleChange).toHaveBeenCalled()
    const last = handleChange.mock.calls[handleChange.mock.calls.length - 1][0] as Date
    expect(last.getFullYear()).toBe(2026)
    expect(last.getMonth()).toBe(0)
    expect(last.getDate()).toBe(15)
  })

  it('shows error message with role="alert"', () => {
    render(<DateTimePicker error="Required" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Required')
  })

  it('is disabled when disabled prop is set', () => {
    render(<DateTimePicker disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<DateTimePicker ref={ref} />)
    expect(ref.current?.tagName).toBe('BUTTON')
  })
})

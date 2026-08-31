import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { DateRangePicker } from './date-range-picker'

describe('DateRangePicker', () => {
  it('renders placeholder when no value is set', () => {
    render(<DateRangePicker placeholder="Pick a date range" />)
    expect(screen.getByText('Pick a date range')).toBeInTheDocument()
  })

  it('renders formatted "from → to" when a full range is set', () => {
    render(<DateRangePicker value={{ from: new Date(2026, 0, 1), to: new Date(2026, 0, 10) }} />)
    expect(screen.getByRole('button').textContent).toContain('→')
    expect(screen.getByRole('button').textContent).toContain('2026')
  })

  it('renders "from → ..." when only the start is set', () => {
    render(<DateRangePicker value={{ from: new Date(2026, 0, 1), to: null }} />)
    expect(screen.getByRole('button').textContent).toContain('...')
  })

  it('opens the calendar dialog on click', async () => {
    render(<DateRangePicker />)
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('dialog', { name: /date range picker/i })).toBeInTheDocument()
  })

  it('closes the calendar when clicking outside', async () => {
    render(
      <div>
        <DateRangePicker />
        <button>Outside</button>
      </div>
    )
    await userEvent.click(screen.getByRole('button', { name: /pick a date range/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Outside' }))
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('calls onValueChange when a day is picked', async () => {
    const handleChange = vi.fn()
    render(<DateRangePicker onValueChange={handleChange} />)
    await userEvent.click(screen.getByRole('button'))
    const dayButtons = screen.getAllByRole('gridcell')
    const firstDay = dayButtons.find(cell => cell.querySelector('button:not([disabled])'))
    const button = firstDay?.querySelector('button')
    expect(button).toBeTruthy()
    await userEvent.click(button!)
    expect(handleChange).toHaveBeenCalled()
    const range = handleChange.mock.calls[0][0] as { from: Date | null; to: Date | null }
    expect(range.from).toBeInstanceOf(Date)
  })

  it('shows error message with role="alert"', () => {
    render(<DateRangePicker error="Required" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Required')
  })

  it('is disabled when disabled prop is set', () => {
    render(<DateRangePicker disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<DateRangePicker ref={ref} />)
    expect(ref.current?.tagName).toBe('BUTTON')
  })
})

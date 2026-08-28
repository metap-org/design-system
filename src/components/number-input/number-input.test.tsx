import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { NumberInput } from './number-input'

describe('NumberInput', () => {
  it('renders with a label', () => {
    render(<NumberInput label="Số lượng" />)
    expect(screen.getByLabelText('Số lượng')).toBeInTheDocument()
  })

  it('increments the value when the up button is clicked (uncontrolled)', async () => {
    render(<NumberInput label="Số lượng" defaultValue={1} />)
    await userEvent.click(screen.getByRole('button', { name: 'Tăng' }))
    expect(screen.getByLabelText('Số lượng')).toHaveValue(2)
  })

  it('decrements the value when the down button is clicked (uncontrolled)', async () => {
    render(<NumberInput label="Số lượng" defaultValue={5} />)
    await userEvent.click(screen.getByRole('button', { name: 'Giảm' }))
    expect(screen.getByLabelText('Số lượng')).toHaveValue(4)
  })

  it('respects step', async () => {
    render(<NumberInput label="Số lượng" defaultValue={0} step={5} />)
    await userEvent.click(screen.getByRole('button', { name: 'Tăng' }))
    expect(screen.getByLabelText('Số lượng')).toHaveValue(5)
  })

  it('clamps to max and disables the up button at the ceiling', async () => {
    render(<NumberInput label="Số lượng" defaultValue={9} max={10} />)
    await userEvent.click(screen.getByRole('button', { name: 'Tăng' }))
    expect(screen.getByLabelText('Số lượng')).toHaveValue(10)
    expect(screen.getByRole('button', { name: 'Tăng' })).toBeDisabled()
  })

  it('clamps to min and disables the down button at the floor', async () => {
    render(<NumberInput label="Số lượng" defaultValue={1} min={0} />)
    await userEvent.click(screen.getByRole('button', { name: 'Giảm' }))
    expect(screen.getByLabelText('Số lượng')).toHaveValue(0)
    expect(screen.getByRole('button', { name: 'Giảm' })).toBeDisabled()
  })

  it('calls onChange with the numeric value in controlled mode', async () => {
    const handleChange = vi.fn()
    render(<NumberInput label="Số lượng" value={3} onChange={handleChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Tăng' }))
    expect(handleChange).toHaveBeenCalledWith(4)
  })

  it('does not change its own displayed value in controlled mode until the prop updates', async () => {
    const handleChange = vi.fn()
    render(<NumberInput label="Số lượng" value={3} onChange={handleChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Tăng' }))
    expect(screen.getByLabelText('Số lượng')).toHaveValue(3)
  })

  it('shows error message and marks the input invalid styling', () => {
    render(<NumberInput label="Số lượng" error="Bắt buộc nhập" />)
    expect(screen.getByText('Bắt buộc nhập')).toBeInTheDocument()
  })

  it('disables the stepper buttons when the input is disabled', () => {
    render(<NumberInput label="Số lượng" disabled />)
    expect(screen.getByRole('button', { name: 'Tăng' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Giảm' })).toBeDisabled()
  })
})

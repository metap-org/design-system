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

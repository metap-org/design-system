import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Select } from './select'

const OPTIONS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry', disabled: true },
]

describe('Select', () => {
  it('renders trigger with placeholder when no value', () => {
    render(<Select options={OPTIONS} placeholder="Pick a fruit" />)
    expect(screen.getByRole('combobox')).toHaveTextContent('Pick a fruit')
  })

  it('renders selected label when value matches', () => {
    render(<Select options={OPTIONS} value="banana" />)
    expect(screen.getByRole('combobox')).toHaveTextContent('Banana')
  })

  it('opens listbox on click', async () => {
    render(<Select options={OPTIONS} />)
    const trigger = screen.getByRole('combobox')
    expect(screen.queryByRole('listbox')).toBeNull()
    await userEvent.click(trigger)
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('closes listbox when clicking trigger again', async () => {
    render(<Select options={OPTIONS} />)
    const trigger = screen.getByRole('combobox')
    await userEvent.click(trigger)
    await userEvent.click(trigger)
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('closes listbox when clicking outside', async () => {
    render(
      <div>
        <Select options={OPTIONS} />
        <button>Outside</button>
      </div>
    )
    await userEvent.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    await userEvent.click(screen.getByText('Outside'))
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('calls onValueChange when an option is clicked', async () => {
    const handleChange = vi.fn()
    render(<Select options={OPTIONS} onValueChange={handleChange} />)
    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.click(screen.getByRole('option', { name: 'Apple' }))
    expect(handleChange).toHaveBeenCalledWith('apple')
  })

  it('does not call onValueChange for disabled option', async () => {
    const handleChange = vi.fn()
    render(<Select options={OPTIONS} onValueChange={handleChange} />)
    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.click(screen.getByRole('option', { name: 'Cherry' }))
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('closes listbox after selecting an option', async () => {
    render(<Select options={OPTIONS} onValueChange={vi.fn()} />)
    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.click(screen.getByRole('option', { name: 'Apple' }))
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('opens with ArrowDown key and marks aria-expanded', async () => {
    render(<Select options={OPTIONS} />)
    const trigger = screen.getByRole('combobox')
    trigger.focus()
    await userEvent.keyboard('{ArrowDown}')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('closes with Escape key', async () => {
    render(<Select options={OPTIONS} />)
    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('renders label and associates it with trigger', () => {
    render(<Select options={OPTIONS} label="Fruit" />)
    expect(screen.getByText('Fruit')).toBeInTheDocument()
    // label htmlFor should match trigger id
    const label = screen.getByText('Fruit')
    const trigger = screen.getByRole('combobox')
    expect(label.getAttribute('for')).toBe(trigger.getAttribute('id'))
  })

  it('renders error message with role=alert', () => {
    render(<Select options={OPTIONS} error="Required" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Required')
  })

  it('renders helperText when no error', () => {
    render(<Select options={OPTIONS} helperText="Pick one" />)
    expect(screen.getByText('Pick one')).toBeInTheDocument()
  })

  it('does not render helperText when error is present', () => {
    render(<Select options={OPTIONS} error="Error" helperText="Pick one" />)
    expect(screen.queryByText('Pick one')).toBeNull()
  })

  it('is disabled when disabled prop is set', () => {
    render(<Select options={OPTIONS} disabled />)
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('does not open when disabled', async () => {
    render(<Select options={OPTIONS} disabled />)
    await userEvent.click(screen.getByRole('combobox'))
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('marks selected option with aria-selected=true', async () => {
    render(<Select options={OPTIONS} value="banana" />)
    await userEvent.click(screen.getByRole('combobox'))
    const selected = screen.getByRole('option', { name: 'Banana' })
    expect(selected).toHaveAttribute('aria-selected', 'true')
  })

  it('marks disabled option with aria-disabled=true', async () => {
    render(<Select options={OPTIONS} />)
    await userEvent.click(screen.getByRole('combobox'))
    const disabled = screen.getByRole('option', { name: 'Cherry' })
    expect(disabled).toHaveAttribute('aria-disabled', 'true')
  })

  it('forwards ref to trigger button', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Select options={OPTIONS} ref={ref} />)
    expect(ref.current?.tagName).toBe('BUTTON')
  })

  it('merges custom className onto trigger', () => {
    render(<Select options={OPTIONS} className="extra-class" />)
    expect(screen.getByRole('combobox')).toHaveClass('extra-class')
  })
})

import * as React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Autocomplete, type AutocompleteOption } from './autocomplete'

const OPTIONS: AutocompleteOption[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry', disabled: true },
]

describe('Autocomplete', () => {
  it('renders the input with placeholder', () => {
    render(<Autocomplete placeholder="Search fruit" />)
    expect(screen.getByPlaceholderText('Search fruit')).toBeInTheDocument()
  })

  it('shows filtered static options on focus', async () => {
    render(<Autocomplete options={OPTIONS} />)
    await userEvent.click(screen.getByRole('combobox'))
    expect(await screen.findByRole('option', { name: 'Apple' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Banana' })).toBeInTheDocument()
  })

  it('filters options as the user types', async () => {
    render(<Autocomplete options={OPTIONS} />)
    const input = screen.getByRole('combobox')
    await userEvent.type(input, 'ban')
    expect(await screen.findByRole('option', { name: 'Banana' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Apple' })).toBeNull()
  })

  it('selects an option on click and calls onValueChange', async () => {
    const handleChange = vi.fn()
    render(<Autocomplete options={OPTIONS} onValueChange={handleChange} />)
    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.click(await screen.findByRole('option', { name: 'Apple' }))
    expect(handleChange).toHaveBeenCalledWith('apple')
  })

  it('does not select a disabled option', async () => {
    const handleChange = vi.fn()
    render(<Autocomplete options={OPTIONS} onValueChange={handleChange} />)
    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.click(await screen.findByRole('option', { name: 'Cherry' }))
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('navigates options with ArrowDown/Enter', async () => {
    const handleChange = vi.fn()
    render(<Autocomplete options={OPTIONS} onValueChange={handleChange} />)
    const input = screen.getByRole('combobox')
    await userEvent.click(input)
    await userEvent.keyboard('{ArrowDown}{Enter}')
    expect(handleChange).toHaveBeenCalledWith('apple')
  })

  it('closes the listbox on Escape', async () => {
    render(<Autocomplete options={OPTIONS} />)
    await userEvent.click(screen.getByRole('combobox'))
    await screen.findByRole('option', { name: 'Apple' })
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('option', { name: 'Apple' })).toBeNull()
  })

  it('shows a clear button when a value is selected and clears it on click', async () => {
    const handleChange = vi.fn()
    render(<Autocomplete options={OPTIONS} value="apple" onValueChange={handleChange} />)
    const clearBtn = screen.getByRole('button', { name: /clear selection/i })
    await userEvent.click(clearBtn)
    expect(handleChange).toHaveBeenCalledWith(null)
  })

  it('calls onSearch (debounced) instead of static filtering when provided', async () => {
    const onSearch = vi.fn().mockResolvedValue([{ label: 'Remote result', value: 'r1' }])
    render(<Autocomplete onSearch={onSearch} />)
    const input = screen.getByRole('combobox')
    await userEvent.type(input, 'x')
    await waitFor(() => expect(onSearch).toHaveBeenCalledWith('x'), { timeout: 1000 })
    expect(await screen.findByRole('option', { name: 'Remote result' })).toBeInTheDocument()
  })

  it('shows error message with role="alert"', () => {
    render(<Autocomplete error="Required" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Required')
  })

  it('is disabled when disabled prop is set', () => {
    render(<Autocomplete disabled />)
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('forwards ref to the input element', () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<Autocomplete ref={ref} />)
    expect(ref.current?.tagName).toBe('INPUT')
  })
})

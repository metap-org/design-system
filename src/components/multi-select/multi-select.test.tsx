import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { MultiSelect } from './multi-select'

const OPTIONS = [
  { label: 'Name', value: 'name' },
  { label: 'Email', value: 'email' },
  { label: 'Status', value: 'status' },
]

describe('MultiSelect', () => {
  it('renders selected values as badges', () => {
    render(<MultiSelect options={OPTIONS} value={['name']} onChange={() => {}} />)
    expect(screen.getByText('Name')).toBeInTheDocument()
  })

  it('only offers options not already selected', async () => {
    render(<MultiSelect options={OPTIONS} value={['name']} onChange={() => {}} />)
    await userEvent.click(screen.getByRole('combobox'))
    expect(screen.queryByRole('option', { name: 'Name' })).toBeNull()
    expect(screen.getByRole('option', { name: 'Email' })).toBeInTheDocument()
  })

  it('calls onChange with the value appended when an option is picked', async () => {
    const onChange = vi.fn()
    render(<MultiSelect options={OPTIONS} value={['name']} onChange={onChange} />)
    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.click(screen.getByRole('option', { name: 'Email' }))
    expect(onChange).toHaveBeenCalledWith(['name', 'email'])
  })

  it('calls onChange with the value removed when a badge is removed', async () => {
    const onChange = vi.fn()
    render(<MultiSelect options={OPTIONS} value={['name', 'email']} onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Remove Name' }))
    expect(onChange).toHaveBeenCalledWith(['email'])
  })

  it('hides the select trigger once every option is selected', () => {
    render(
      <MultiSelect options={OPTIONS} value={OPTIONS.map((o) => o.value)} onChange={() => {}} />
    )
    expect(screen.queryByRole('combobox')).toBeNull()
  })

  it('renders a label', () => {
    render(<MultiSelect options={OPTIONS} value={[]} onChange={() => {}} label="Fields" />)
    expect(screen.getByText('Fields')).toBeInTheDocument()
  })

  it('renders error message with role=alert', () => {
    render(<MultiSelect options={OPTIONS} value={[]} onChange={() => {}} error="Required" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Required')
  })

  it('forwards ref to the root element', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<MultiSelect options={OPTIONS} value={[]} onChange={() => {}} ref={ref} />)
    expect(ref.current?.tagName).toBe('DIV')
  })
})

import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { SuggestInput } from './suggest-input'

describe('SuggestInput', () => {
  it('renders the current value in the input', () => {
    render(<SuggestInput value="tenantId" onChange={() => {}} />)
    expect(screen.getByRole('textbox')).toHaveValue('tenantId')
  })

  it('calls onChange when typing', async () => {
    const onChange = vi.fn()
    render(<SuggestInput value="" onChange={onChange} />)
    await userEvent.type(screen.getByRole('textbox'), 'x')
    expect(onChange).toHaveBeenCalledWith('x')
  })

  it('renders suggestion chips', () => {
    render(<SuggestInput value="" onChange={() => {}} suggestions={['tenantId', 'userId']} />)
    expect(screen.getByText('tenantId')).toBeInTheDocument()
    expect(screen.getByText('userId')).toBeInTheDocument()
  })

  it('sets the value when a suggestion chip is clicked', async () => {
    const onChange = vi.fn()
    render(<SuggestInput value="" onChange={onChange} suggestions={['tenantId', 'userId']} />)
    await userEvent.click(screen.getByText('userId'))
    expect(onChange).toHaveBeenCalledWith('userId')
  })

  it('renders no suggestion row when suggestions is empty', () => {
    const { container } = render(<SuggestInput value="" onChange={() => {}} suggestions={[]} />)
    expect(container.querySelectorAll('.rounded-full').length).toBe(0)
  })

  it('forwards ref to the underlying input', () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<SuggestInput value="" onChange={() => {}} ref={ref} />)
    expect(ref.current?.tagName).toBe('INPUT')
  })
})

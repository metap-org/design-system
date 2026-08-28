import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { Textarea } from './textarea'

describe('Textarea', () => {
  it('renders a textarea element', () => {
    render(<Textarea />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders label linked to textarea', () => {
    render(<Textarea label="Notes" />)
    expect(screen.getByRole('textbox')).toHaveAccessibleName('Notes')
  })

  it('renders error message with role=alert', () => {
    render(<Textarea error="Required field" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Required field')
  })

  it('applies error border class when error present', () => {
    render(<Textarea error="Invalid" />)
    expect(screen.getByRole('textbox')).toHaveClass('border-destructive')
  })

  it('renders helper text when no error', () => {
    render(<Textarea helperText="Max 500 characters" />)
    expect(screen.getByText('Max 500 characters')).toBeInTheDocument()
  })

  it('hides helper text when error is present', () => {
    render(<Textarea error="Error msg" helperText="Helper msg" />)
    expect(screen.queryByText('Helper msg')).toBeNull()
  })

  it('accepts typed input', async () => {
    render(<Textarea />)
    await userEvent.type(screen.getByRole('textbox'), 'hello world')
    expect(screen.getByRole('textbox')).toHaveValue('hello world')
  })

  it('is disabled when disabled prop is set', () => {
    render(<Textarea disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLTextAreaElement>()
    render(<Textarea ref={ref} />)
    expect(ref.current?.tagName).toBe('TEXTAREA')
  })
})

import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { Input } from './input'

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders label linked to input', () => {
    render(<Input label="Email" />)
    expect(screen.getByRole('textbox')).toHaveAccessibleName('Email')
  })

  it('renders error message with role=alert', () => {
    render(<Input error="Required field" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Required field')
  })

  it('applies error border class when error present', () => {
    render(<Input error="Invalid" />)
    expect(screen.getByRole('textbox')).toHaveClass('border-destructive')
  })

  it('renders helper text when no error', () => {
    render(<Input helperText="Enter your email" />)
    expect(screen.getByText('Enter your email')).toBeInTheDocument()
  })

  it('hides helper text when error is present', () => {
    render(<Input error="Error msg" helperText="Helper msg" />)
    expect(screen.queryByText('Helper msg')).toBeNull()
  })

  it('renders startAdornment', () => {
    render(<Input startAdornment={<span data-testid="start" />} />)
    expect(screen.getByTestId('start')).toBeInTheDocument()
  })

  it('renders endAdornment', () => {
    render(<Input endAdornment={<span data-testid="end" />} />)
    expect(screen.getByTestId('end')).toBeInTheDocument()
  })

  it('applies pl-9 when startAdornment present', () => {
    render(<Input startAdornment={<span />} />)
    expect(screen.getByRole('textbox')).toHaveClass('pl-9')
  })

  it('accepts typed input', async () => {
    render(<Input />)
    await userEvent.type(screen.getByRole('textbox'), 'hello')
    expect(screen.getByRole('textbox')).toHaveValue('hello')
  })

  it('is disabled when disabled prop is set', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<Input ref={ref} />)
    expect(ref.current?.tagName).toBe('INPUT')
  })
})

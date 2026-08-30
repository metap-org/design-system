import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Spinner } from './spinner'

describe('Spinner', () => {
  it('renders with role="status"', () => {
    render(<Spinner />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('has a screen-reader-only loading label by default', () => {
    render(<Spinner />)
    expect(screen.getByText('Đang tải...')).toBeInTheDocument()
  })

  it('accepts a custom label', () => {
    render(<Spinner label="Đang xử lý đơn hàng..." />)
    expect(screen.getByText('Đang xử lý đơn hàng...')).toBeInTheDocument()
  })

  it('applies default size classes', () => {
    const { container } = render(<Spinner />)
    expect(container.querySelector('svg')).toHaveClass('h-6')
  })

  it('applies sm size classes', () => {
    const { container } = render(<Spinner size="sm" />)
    expect(container.querySelector('svg')).toHaveClass('h-4')
  })

  it('applies lg size classes', () => {
    const { container } = render(<Spinner size="lg" />)
    expect(container.querySelector('svg')).toHaveClass('h-8')
  })

  it('has the spin animation class', () => {
    const { container } = render(<Spinner />)
    expect(container.querySelector('svg')).toHaveClass('animate-spin')
  })
})

import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Badge } from './badge'

describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge>Active</Badge>)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('applies default variant classes', () => {
    const { container } = render(<Badge>Active</Badge>)
    expect(container.firstChild).toHaveClass('bg-primary')
  })

  it('applies secondary variant', () => {
    const { container } = render(<Badge variant="secondary">Draft</Badge>)
    expect(container.firstChild).toHaveClass('bg-secondary')
  })

  it('applies destructive variant', () => {
    const { container } = render(<Badge variant="destructive">Error</Badge>)
    expect(container.firstChild).toHaveClass('bg-destructive')
  })

  it('applies outline variant', () => {
    const { container } = render(<Badge variant="outline">Neutral</Badge>)
    expect(container.firstChild).toHaveClass('border-border')
  })

  it('applies success variant', () => {
    const { container } = render(<Badge variant="success">Done</Badge>)
    expect(container.firstChild).toHaveClass('bg-emerald-600')
  })

  it('applies warning variant', () => {
    const { container } = render(<Badge variant="warning">Pending</Badge>)
    expect(container.firstChild).toHaveClass('bg-amber-500')
  })

  it('is not interactive by default (renders as a span, no button role)', () => {
    render(<Badge>Active</Badge>)
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('merges custom className', () => {
    const { container } = render(<Badge className="custom-class">Active</Badge>)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLSpanElement>()
    render(<Badge ref={ref}>Active</Badge>)
    expect(ref.current?.tagName).toBe('SPAN')
  })
})

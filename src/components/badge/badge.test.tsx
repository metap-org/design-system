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
    expect(container.firstChild).toHaveClass('bg-success')
  })

  it('applies warning variant', () => {
    const { container } = render(<Badge variant="warning">Pending</Badge>)
    expect(container.firstChild).toHaveClass('bg-warning')
  })

  it('applies info and the quiet (soft) variants from the status tokens', () => {
    const { container } = render(
      <>
        <Badge variant="info">i</Badge>
        <Badge variant="success-soft">s</Badge>
        <Badge variant="destructive-soft">d</Badge>
      </>
    )
    expect(container.children[0]).toHaveClass('bg-info')
    expect(container.children[1]).toHaveClass('text-success', 'bg-success/10')
    expect(container.children[2]).toHaveClass('text-destructive', 'bg-destructive/10')
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

import * as React from 'react'
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Skeleton } from './skeleton'

describe('Skeleton', () => {
  it('applies pulse animation and base classes', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveClass('animate-pulse')
    expect(container.firstChild).toHaveClass('bg-muted')
  })

  it('is hidden from assistive tech (aria-hidden)', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('accepts custom width/height via className', () => {
    const { container } = render(<Skeleton className="h-4 w-32" />)
    expect(container.firstChild).toHaveClass('h-4')
    expect(container.firstChild).toHaveClass('w-32')
  })

  it('merges custom className without dropping base classes', () => {
    const { container } = render(<Skeleton className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
    expect(container.firstChild).toHaveClass('animate-pulse')
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Skeleton ref={ref} />)
    expect(ref.current?.tagName).toBe('DIV')
  })
})

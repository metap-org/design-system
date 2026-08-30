import * as React from 'react'
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Separator } from './separator'

describe('Separator', () => {
  it('renders horizontal classes by default', () => {
    const { container } = render(<Separator />)
    expect(container.firstChild).toHaveClass('h-px')
    expect(container.firstChild).toHaveClass('w-full')
  })

  it('renders vertical classes when orientation="vertical"', () => {
    const { container } = render(<Separator orientation="vertical" />)
    expect(container.firstChild).toHaveClass('h-full')
    expect(container.firstChild).toHaveClass('w-px')
  })

  it('is decorative by default (role="none", no aria-orientation)', () => {
    const { container } = render(<Separator />)
    const el = container.firstChild as HTMLElement
    expect(el).toHaveAttribute('role', 'none')
    expect(el).not.toHaveAttribute('aria-orientation')
  })

  it('exposes role="separator" and aria-orientation when decorative={false}', () => {
    const { container } = render(<Separator decorative={false} orientation="vertical" />)
    const el = container.firstChild as HTMLElement
    expect(el).toHaveAttribute('role', 'separator')
    expect(el).toHaveAttribute('aria-orientation', 'vertical')
  })

  it('merges custom className', () => {
    const { container } = render(<Separator className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Separator ref={ref} />)
    expect(ref.current?.tagName).toBe('DIV')
  })
})

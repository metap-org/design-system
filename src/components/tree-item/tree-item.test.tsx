import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TreeItem } from './tree-item'

describe('TreeItem', () => {
  it('renders children', () => {
    render(
      <TreeItem depth={0}>
        <span>Content</span>
      </TreeItem>
    )
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('has no border/indent classes at depth 0 (root)', () => {
    const { container } = render(<TreeItem depth={0}>Root</TreeItem>)
    expect(container.firstChild).not.toHaveClass('border-l-2')
    expect(container.firstChild).not.toHaveClass('ml-2')
  })

  it('applies border/indent classes at depth > 0', () => {
    const { container } = render(<TreeItem depth={1}>Child</TreeItem>)
    expect(container.firstChild).toHaveClass('border-l-2')
    expect(container.firstChild).toHaveClass('pl-4')
    expect(container.firstChild).toHaveClass('ml-2')
  })

  it('exposes depth via data-depth attribute', () => {
    const { container } = render(<TreeItem depth={3}>Nested</TreeItem>)
    expect(container.firstChild).toHaveAttribute('data-depth', '3')
  })

  it('merges custom className', () => {
    const { container } = render(
      <TreeItem depth={1} className="custom-class">
        Child
      </TreeItem>
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <TreeItem depth={0} ref={ref}>
        Root
      </TreeItem>
    )
    expect(ref.current?.tagName).toBe('DIV')
  })

  it('supports recursive nesting (consumer owns the recursion)', () => {
    render(
      <TreeItem depth={0}>
        <TreeItem depth={1}>
          <TreeItem depth={2}>Deep</TreeItem>
        </TreeItem>
      </TreeItem>
    )
    expect(screen.getByText('Deep')).toBeInTheDocument()
  })
})

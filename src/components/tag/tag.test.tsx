import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Tag } from './tag'

describe('Tag', () => {
  it('renders label text', () => {
    render(<Tag label="Đồ uống" />)
    expect(screen.getByText('Đồ uống')).toBeInTheDocument()
  })

  it('applies default gray color classes', () => {
    const { container } = render(<Tag label="Khác" />)
    expect(container.firstChild).toHaveClass('bg-muted')
  })

  it('applies blue color', () => {
    const { container } = render(<Tag label="Món chính" color="blue" />)
    expect(container.firstChild).toHaveClass('bg-blue-100')
  })

  it('applies green color', () => {
    const { container } = render(<Tag label="Rau củ" color="green" />)
    expect(container.firstChild).toHaveClass('bg-green-100')
  })

  it('applies yellow color', () => {
    const { container } = render(<Tag label="Khuyến mãi" color="yellow" />)
    expect(container.firstChild).toHaveClass('bg-yellow-100')
  })

  it('applies red color', () => {
    const { container } = render(<Tag label="Hết hàng" color="red" />)
    expect(container.firstChild).toHaveClass('bg-red-100')
  })

  it('applies purple color', () => {
    const { container } = render(<Tag label="VIP" color="purple" />)
    expect(container.firstChild).toHaveClass('bg-purple-100')
  })

  it('merges custom className', () => {
    const { container } = render(<Tag label="Khác" className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLSpanElement>()
    render(<Tag ref={ref} label="Khác" />)
    expect(ref.current?.tagName).toBe('SPAN')
  })
})

import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BarChart } from './bar-chart'

describe('BarChart', () => {
  it('renders one bar per datum', () => {
    const { container } = render(
      <BarChart
        data={[
          { label: 'Open', value: 3 },
          { label: 'Done', value: 5 },
        ]}
      />
    )
    expect(container.querySelectorAll('rect')).toHaveLength(2)
  })

  it('renders an accessible img role with a default label', () => {
    render(<BarChart data={[{ label: 'Open', value: 3 }]} />)
    expect(screen.getByRole('img', { name: 'Bar chart' })).toBeInTheDocument()
  })

  it('uses ariaLabel when provided', () => {
    render(<BarChart data={[{ label: 'Open', value: 3 }]} ariaLabel="Issues by status" />)
    expect(screen.getByRole('img', { name: 'Issues by status' })).toBeInTheDocument()
  })

  it('renders each value and label as text', () => {
    render(<BarChart data={[{ label: 'Open', value: 3 }]} />)
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('Open')).toBeInTheDocument()
  })

  it('draws a bar for a zero-value datum without a NaN height', () => {
    const { container } = render(<BarChart data={[{ label: 'Empty', value: 0 }]} />)
    const rect = container.querySelector('rect')
    expect(rect).toHaveAttribute('height', '0')
  })

  it('uses the per-bar color when provided, default primary otherwise', () => {
    const { container } = render(
      <BarChart
        data={[
          { label: 'Red', value: 1, color: 'hsl(var(--destructive))' },
          { label: 'Default', value: 1 },
        ]}
      />
    )
    const rects = container.querySelectorAll('rect')
    expect(rects[0]).toHaveAttribute('fill', 'hsl(var(--destructive))')
    expect(rects[1]).toHaveAttribute('fill', 'hsl(var(--primary))')
  })

  it('merges custom className onto the svg', () => {
    const { container } = render(
      <BarChart data={[{ label: 'Open', value: 1 }]} className="my-chart" />
    )
    expect(container.querySelector('svg')).toHaveClass('my-chart', 'block', 'max-w-full')
  })

  it('forwards ref to the svg element', () => {
    const ref = React.createRef<SVGSVGElement>()
    render(<BarChart ref={ref} data={[{ label: 'Open', value: 1 }]} />)
    expect(ref.current?.tagName.toLowerCase()).toBe('svg')
  })
})

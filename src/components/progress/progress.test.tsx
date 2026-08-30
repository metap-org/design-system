import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Progress } from './progress'

describe('Progress', () => {
  it('renders with role="progressbar"', () => {
    render(<Progress value={50} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('exposes aria-valuenow/min/max', () => {
    render(<Progress value={30} max={100} />)
    const el = screen.getByRole('progressbar')
    expect(el).toHaveAttribute('aria-valuenow', '30')
    expect(el).toHaveAttribute('aria-valuemin', '0')
    expect(el).toHaveAttribute('aria-valuemax', '100')
  })

  it('renders the inner bar width proportional to value/max', () => {
    render(<Progress value={25} max={100} />)
    const bar = screen.getByRole('progressbar').firstChild as HTMLElement
    expect(bar).toHaveStyle({ width: '25%' })
  })

  it('clamps value above max to 100%', () => {
    render(<Progress value={999} max={100} />)
    const bar = screen.getByRole('progressbar').firstChild as HTMLElement
    expect(bar).toHaveStyle({ width: '100%' })
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
  })

  it('clamps negative value to 0%', () => {
    render(<Progress value={-10} max={100} />)
    const bar = screen.getByRole('progressbar').firstChild as HTMLElement
    expect(bar).toHaveStyle({ width: '0%' })
  })

  it('defaults value to 0 when not provided', () => {
    render(<Progress />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Progress ref={ref} value={10} />)
    expect(ref.current?.tagName).toBe('DIV')
  })
})

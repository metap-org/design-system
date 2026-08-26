import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Avatar } from './avatar'

describe('Avatar', () => {
  it('renders fallback initials when no src', () => {
    render(<Avatar fallback="PM" />)
    expect(screen.getByText('PM')).toBeInTheDocument()
  })

  it('truncates fallback to 2 uppercase chars', () => {
    render(<Avatar fallback="peter" />)
    expect(screen.getByText('PE')).toBeInTheDocument()
  })

  it('renders ? when no fallback and no src', () => {
    render(<Avatar />)
    expect(screen.getByText('?')).toBeInTheDocument()
  })

  it('renders image when src is provided', () => {
    render(<Avatar src="https://example.com/photo.jpg" alt="User photo" />)
    expect(screen.getByRole('img', { name: 'User photo' })).toBeInTheDocument()
  })

  it('applies sm size class', () => {
    const { container } = render(<Avatar size="sm" fallback="AB" />)
    expect(container.firstChild).toHaveClass('h-8', 'w-8')
  })

  it('applies lg size class', () => {
    const { container } = render(<Avatar size="lg" fallback="AB" />)
    expect(container.firstChild).toHaveClass('h-12', 'w-12')
  })

  it('merges custom className', () => {
    const { container } = render(<Avatar fallback="AB" className="ring-2" />)
    expect(container.firstChild).toHaveClass('ring-2')
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLSpanElement>()
    render(<Avatar ref={ref} fallback="AB" />)
    expect(ref.current?.tagName).toBe('SPAN')
  })
})

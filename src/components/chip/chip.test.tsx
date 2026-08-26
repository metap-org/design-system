import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Chip } from './chip'

describe('Chip', () => {
  it('renders label text', () => {
    render(<Chip label="React" />)
    expect(screen.getByText('React')).toBeInTheDocument()
  })

  it('applies default variant classes', () => {
    const { container } = render(<Chip label="Tag" />)
    expect(container.firstChild).toHaveClass('bg-primary')
  })

  it('applies secondary variant', () => {
    const { container } = render(<Chip label="Tag" variant="secondary" />)
    expect(container.firstChild).toHaveClass('bg-secondary')
  })

  it('applies destructive variant', () => {
    const { container } = render(<Chip label="Error" variant="destructive" />)
    expect(container.firstChild).toHaveClass('bg-destructive')
  })

  it('applies outline variant', () => {
    const { container } = render(<Chip label="Tag" variant="outline" />)
    expect(container.firstChild).toHaveClass('border-border')
  })

  it('renders close button when onClose provided', () => {
    render(<Chip label="React" onClose={() => {}} />)
    expect(screen.getByRole('button', { name: 'Remove React' })).toBeInTheDocument()
  })

  it('does not render close button when onClose absent', () => {
    render(<Chip label="React" />)
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('calls onClose when close button clicked', async () => {
    const handleClose = vi.fn()
    render(<Chip label="React" onClose={handleClose} />)
    await userEvent.click(screen.getByRole('button', { name: 'Remove React' }))
    expect(handleClose).toHaveBeenCalledOnce()
  })

  it('merges custom className', () => {
    const { container } = render(<Chip label="Tag" className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})

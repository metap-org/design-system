import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Pagination } from './pagination'

describe('Pagination', () => {
  it('renders all pages when totalPages is small', () => {
    render(<Pagination page={1} totalPages={3} onPageChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument()
  })

  it('marks the current page with aria-current', () => {
    render(<Pagination page={2} totalPages={3} onPageChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: '2' })).toHaveAttribute('aria-current', 'page')
  })

  it('disables Previous on the first page', () => {
    render(<Pagination page={1} totalPages={5} onPageChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Trang trước' })).toBeDisabled()
  })

  it('disables Next on the last page', () => {
    render(<Pagination page={5} totalPages={5} onPageChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Trang sau' })).toBeDisabled()
  })

  it('calls onPageChange with the next page when Next is clicked', async () => {
    const onPageChange = vi.fn()
    render(<Pagination page={2} totalPages={5} onPageChange={onPageChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Trang sau' }))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('calls onPageChange when a page number is clicked', async () => {
    const onPageChange = vi.fn()
    render(<Pagination page={1} totalPages={5} onPageChange={onPageChange} />)
    await userEvent.click(screen.getByRole('button', { name: '3' }))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('shows ellipsis for a large page range', () => {
    render(<Pagination page={10} totalPages={20} onPageChange={vi.fn()} />)
    expect(screen.getAllByText('…').length).toBeGreaterThan(0)
  })

  it('always shows the first and last page in a large range', () => {
    render(<Pagination page={10} totalPages={20} onPageChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '20' })).toBeInTheDocument()
  })
})

import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb'

function renderBreadcrumb() {
  return render(
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/products">Sản phẩm</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Cà phê</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

describe('Breadcrumb', () => {
  it('renders as a nav landmark with aria-label', () => {
    renderBreadcrumb()
    expect(screen.getByRole('navigation', { name: 'breadcrumb' })).toBeInTheDocument()
  })

  it('renders links for ancestor items', () => {
    renderBreadcrumb()
    expect(screen.getByRole('link', { name: 'Trang chủ' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Sản phẩm' })).toHaveAttribute('href', '/products')
  })

  it('marks the current page with aria-current', () => {
    renderBreadcrumb()
    expect(screen.getByText('Cà phê')).toHaveAttribute('aria-current', 'page')
  })

  it('renders separators hidden from assistive tech', () => {
    const { container } = renderBreadcrumb()
    expect(container.querySelectorAll('[role="presentation"][aria-hidden="true"]')).toHaveLength(2)
  })
})

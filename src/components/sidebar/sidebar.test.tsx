import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Sidebar, SidebarContent, SidebarGroup, SidebarItem } from './sidebar'

function renderSidebar(collapsed: boolean) {
  return render(
    <Sidebar collapsed={collapsed}>
      <SidebarContent>
        <SidebarGroup label="Bảo vệ">
          <SidebarItem asChild label="Zones" active>
            <a href="/zones" />
          </SidebarItem>
          <SidebarItem asChild label="Global rules">
            <a href="/rules" />
          </SidebarItem>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

describe('Sidebar', () => {
  it('renders an item as the consumer link, with its label and active state', () => {
    renderSidebar(false)
    const link = screen.getByRole('link', { name: 'Zones' })
    expect(link).toHaveAttribute('href', '/zones')
    expect(link).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Global rules' })).not.toHaveAttribute('aria-current')
    expect(screen.getByText('Bảo vệ')).toBeInTheDocument()
  })

  it('keeps labels accessible but visually hidden when collapsed, with initials and a tooltip title', () => {
    renderSidebar(true)
    const link = screen.getByRole('link', { name: /Global rules/ })
    expect(link).toHaveAttribute('title', 'Global rules')
    expect(screen.getByText('Global rules')).toHaveClass('sr-only')
    expect(screen.getByText('GR')).toBeInTheDocument()
    expect(screen.queryByText('Bảo vệ')).not.toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Bảo vệ' })).toBeInTheDocument()
  })
})

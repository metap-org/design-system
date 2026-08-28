import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'

function renderTabs() {
  return render(
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Tài khoản</TabsTrigger>
        <TabsTrigger value="password">Mật khẩu</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Nội dung tài khoản</TabsContent>
      <TabsContent value="password">Nội dung mật khẩu</TabsContent>
    </Tabs>
  )
}

describe('Tabs', () => {
  it('shows the default tab content', () => {
    renderTabs()
    expect(screen.getByText('Nội dung tài khoản')).toBeVisible()
  })

  it('hides inactive tab content', () => {
    renderTabs()
    expect(screen.queryByText('Nội dung mật khẩu')).not.toBeInTheDocument()
  })

  it('switches content when a trigger is clicked', async () => {
    renderTabs()
    await userEvent.click(screen.getByRole('tab', { name: 'Mật khẩu' }))
    expect(screen.getByText('Nội dung mật khẩu')).toBeVisible()
  })

  it('marks the active trigger with aria-selected', async () => {
    renderTabs()
    expect(screen.getByRole('tab', { name: 'Tài khoản' })).toHaveAttribute('aria-selected', 'true')
    await userEvent.click(screen.getByRole('tab', { name: 'Mật khẩu' }))
    expect(screen.getByRole('tab', { name: 'Mật khẩu' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Tài khoản' })).toHaveAttribute('aria-selected', 'false')
  })

  it('supports keyboard arrow navigation between tabs', async () => {
    renderTabs()
    screen.getByRole('tab', { name: 'Tài khoản' }).focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Mật khẩu' })).toHaveFocus()
  })
})

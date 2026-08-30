import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from './dropdown-menu'

function renderMenu(onSelect = vi.fn()) {
  render(
    <DropdownMenu>
      <DropdownMenuTrigger>Tuỳ chọn</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onSelect}>Sửa</DropdownMenuItem>
        <DropdownMenuItem>Xoá</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
  return onSelect
}

describe('DropdownMenu', () => {
  it('menu is closed by default', () => {
    renderMenu()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('opens on trigger click and shows items', async () => {
    renderMenu()
    await userEvent.click(screen.getByText('Tuỳ chọn'))
    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'Sửa' })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'Xoá' })).toBeInTheDocument()
  })

  it('calls onSelect and closes when an item is clicked', async () => {
    const onSelect = renderMenu()
    await userEvent.click(screen.getByText('Tuỳ chọn'))
    await userEvent.click(screen.getByRole('menuitem', { name: 'Sửa' }))
    expect(onSelect).toHaveBeenCalledOnce()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('closes on Escape', async () => {
    renderMenu()
    await userEvent.click(screen.getByText('Tuỳ chọn'))
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })
})

import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { Popover, PopoverTrigger, PopoverContent } from './popover'

function renderPopover() {
  return render(
    <Popover>
      <PopoverTrigger>Mở</PopoverTrigger>
      <PopoverContent>Nội dung popover</PopoverContent>
    </Popover>
  )
}

describe('Popover', () => {
  it('is closed by default', () => {
    renderPopover()
    expect(screen.queryByText('Nội dung popover')).not.toBeInTheDocument()
  })

  it('opens on trigger click', async () => {
    renderPopover()
    await userEvent.click(screen.getByText('Mở'))
    expect(screen.getByText('Nội dung popover')).toBeInTheDocument()
  })

  it('closes on Escape', async () => {
    renderPopover()
    await userEvent.click(screen.getByText('Mở'))
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByText('Nội dung popover')).not.toBeInTheDocument()
  })

  it('closes on outside click', async () => {
    renderPopover()
    await userEvent.click(screen.getByText('Mở'))
    await userEvent.click(document.body)
    expect(screen.queryByText('Nội dung popover')).not.toBeInTheDocument()
  })
})

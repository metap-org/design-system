import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from './sheet'

function renderSheet(side?: 'left' | 'right' | 'top' | 'bottom') {
  return render(
    <Sheet>
      <SheetTrigger>Mở panel</SheetTrigger>
      <SheetContent side={side}>
        <SheetTitle>Chi tiết</SheetTitle>
      </SheetContent>
    </Sheet>
  )
}

describe('Sheet', () => {
  it('is closed by default', () => {
    renderSheet()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens on trigger click', async () => {
    renderSheet()
    await userEvent.click(screen.getByText('Mở panel'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Chi tiết')).toBeInTheDocument()
  })

  it('defaults to the right side slide-in classes', async () => {
    renderSheet()
    await userEvent.click(screen.getByText('Mở panel'))
    expect(screen.getByRole('dialog')).toHaveClass('right-0')
  })

  it('applies left side classes when side="left"', async () => {
    renderSheet('left')
    await userEvent.click(screen.getByText('Mở panel'))
    expect(screen.getByRole('dialog')).toHaveClass('left-0')
  })

  it('closes on Escape key', async () => {
    renderSheet()
    await userEvent.click(screen.getByText('Mở panel'))
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from './dialog'

function renderDialog() {
  return render(
    <Dialog>
      <DialogTrigger>Mở</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận</DialogTitle>
          <DialogDescription>Mô tả chi tiết</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>Huỷ</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

describe('Dialog', () => {
  it('is closed by default', () => {
    renderDialog()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens on trigger click and shows title/description', async () => {
    renderDialog()
    await userEvent.click(screen.getByText('Mở'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Xác nhận')).toBeInTheDocument()
    expect(screen.getByText('Mô tả chi tiết')).toBeInTheDocument()
  })

  it('closes on the built-in top-right close button click', async () => {
    renderDialog()
    await userEvent.click(screen.getByText('Mở'))
    await userEvent.click(screen.getByRole('button', { name: 'Đóng' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes via a custom DialogClose in content', async () => {
    renderDialog()
    await userEvent.click(screen.getByText('Mở'))
    await userEvent.click(screen.getByRole('button', { name: 'Huỷ' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes on Escape key', async () => {
    renderDialog()
    await userEvent.click(screen.getByText('Mở'))
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

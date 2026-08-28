import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from './alert-dialog'

function renderAlertDialog(onConfirm = vi.fn()) {
  render(
    <AlertDialog>
      <AlertDialogTrigger>Xoá</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xoá?</AlertDialogTitle>
          <AlertDialogDescription>Không thể hoàn tác.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Huỷ</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Xoá</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
  return onConfirm
}

describe('AlertDialog', () => {
  it('is closed by default', () => {
    renderAlertDialog()
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('opens on trigger click', async () => {
    renderAlertDialog()
    await userEvent.click(screen.getByText('Xoá'))
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    expect(screen.getByText('Xác nhận xoá?')).toBeInTheDocument()
  })

  it('closes on Escape key (Radix default, same as Dialog)', async () => {
    renderAlertDialog()
    await userEvent.click(screen.getByText('Xoá'))
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('calls onConfirm and closes when Action is clicked', async () => {
    const onConfirm = renderAlertDialog()
    await userEvent.click(screen.getByText('Xoá'))
    await userEvent.click(screen.getByRole('button', { name: 'Xoá' }))
    expect(onConfirm).toHaveBeenCalledOnce()
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('closes without calling onConfirm when Cancel is clicked', async () => {
    const onConfirm = renderAlertDialog()
    await userEvent.click(screen.getByText('Xoá'))
    await userEvent.click(screen.getByRole('button', { name: 'Huỷ' }))
    expect(onConfirm).not.toHaveBeenCalled()
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })
})

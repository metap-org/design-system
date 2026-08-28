import type { Meta, StoryObj } from '@storybook/react'
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
import { Button } from '../button/button'

const meta: Meta<typeof AlertDialog> = {
  title: 'Components/AlertDialog',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof AlertDialog>

export const ConfirmDelete: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Xoá sản phẩm</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn chắc chắn muốn xoá?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác. Sản phẩm sẽ bị xoá vĩnh viễn khỏi hệ thống.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Huỷ</AlertDialogCancel>
          <AlertDialogAction>Xoá</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}

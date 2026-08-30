import type { Meta, StoryObj } from '@storybook/react'
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
import { Button } from '../button/button'

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Dialog>

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Mở Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sửa thông tin</DialogTitle>
          <DialogDescription>Cập nhật thông tin sản phẩm rồi lưu lại.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Huỷ</Button>
          </DialogClose>
          <Button>Lưu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

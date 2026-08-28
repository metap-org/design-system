import type { Meta, StoryObj } from '@storybook/react'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './sheet'
import { Button } from '../button/button'

const meta: Meta<typeof Sheet> = {
  title: 'Components/Sheet',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Sheet>

export const Right: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Mở panel (phải)</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Chi tiết đơn hàng</SheetTitle>
          <SheetDescription>Xem nhanh thông tin mà không rời trang danh sách.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
}

export const Left: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Mở panel (trái)</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Bộ lọc</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
}

export const Bottom: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Mở panel (dưới)</Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Thao tác nhanh</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
}

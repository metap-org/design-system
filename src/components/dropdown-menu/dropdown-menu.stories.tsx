import type { Meta, StoryObj } from '@storybook/react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from './dropdown-menu'
import { Button } from '../button/button'

const meta: Meta<typeof DropdownMenu> = {
  title: 'Components/DropdownMenu',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DropdownMenu>

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Tuỳ chọn</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Sửa</DropdownMenuItem>
        <DropdownMenuItem>Nhân bản</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Xoá</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

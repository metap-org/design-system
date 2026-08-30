import type { Meta, StoryObj } from '@storybook/react'
import { Popover, PopoverTrigger, PopoverContent } from './popover'
import { Button } from '../button/button'

const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Popover>

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Mở Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p className="text-sm font-medium">Kích thước</p>
        <p className="text-sm text-muted-foreground">Đặt chiều rộng/chiều cao cho layer này.</p>
      </PopoverContent>
    </Popover>
  ),
}

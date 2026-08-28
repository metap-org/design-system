import type { Meta, StoryObj } from '@storybook/react'
import { Separator } from './separator'

const meta: Meta<typeof Separator> = {
  title: 'Components/Separator',
  component: Separator,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
  },
}

export default meta
type Story = StoryObj<typeof Separator>

export const Horizontal: Story = {
  render: () => (
    <div className="w-64">
      <p className="text-sm">Phần trên</p>
      <Separator className="my-md" />
      <p className="text-sm">Phần dưới</p>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="flex h-10 items-center gap-md">
      <span className="text-sm">Trái</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Phải</span>
    </div>
  ),
}

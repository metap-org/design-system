import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './badge'

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'success', 'warning'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = { args: { children: 'Default', variant: 'default' } }
export const Secondary: Story = { args: { children: 'Draft', variant: 'secondary' } }
export const Destructive: Story = { args: { children: 'Error', variant: 'destructive' } }
export const Outline: Story = { args: { children: 'Neutral', variant: 'outline' } }
export const Success: Story = { args: { children: 'Hoàn thành', variant: 'success' } }
export const Warning: Story = { args: { children: 'Đang chờ', variant: 'warning' } }

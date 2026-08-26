import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from './avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
}

export default meta
type Story = StoryObj<typeof Avatar>

export const WithImage: Story = {
  args: { src: 'https://github.com/shadcn.png', alt: 'Avatar', size: 'md' },
}

export const WithFallback: Story = {
  args: { fallback: 'PM', size: 'md' },
}

export const Small: Story = {
  args: { fallback: 'PM', size: 'sm' },
}

export const Large: Story = {
  args: { fallback: 'PM', size: 'lg' },
}

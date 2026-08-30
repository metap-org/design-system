import type { Meta, StoryObj } from '@storybook/react'
import { IconButton } from './icon-button'

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)

const meta: Meta<typeof IconButton> = {
  title: 'Components/IconButton',
  component: IconButton,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'outline', 'ghost'] },
    size: { control: 'select', options: ['default', 'sm', 'lg'] },
  },
}

export default meta
type Story = StoryObj<typeof IconButton>

export const Default: Story = {
  args: { icon: <XIcon />, 'aria-label': 'Close', variant: 'default', size: 'default' },
}

export const Outline: Story = {
  args: { icon: <XIcon />, 'aria-label': 'Close', variant: 'outline' },
}

export const Ghost: Story = {
  args: { icon: <XIcon />, 'aria-label': 'Close', variant: 'ghost' },
}

export const Small: Story = {
  args: { icon: <XIcon />, 'aria-label': 'Close', size: 'sm' },
}

export const Large: Story = {
  args: { icon: <XIcon />, 'aria-label': 'Close', size: 'lg' },
}

export const Disabled: Story = {
  args: { icon: <XIcon />, 'aria-label': 'Close', disabled: true },
}

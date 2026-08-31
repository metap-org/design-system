import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'outline', 'ghost', 'destructive'] },
    size: { control: 'select', options: ['default', 'sm', 'lg'] },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: { children: 'Button', variant: 'default', size: 'default' },
}

export const Outline: Story = {
  args: { children: 'Outline', variant: 'outline' },
}

export const Ghost: Story = {
  args: { children: 'Ghost', variant: 'ghost' },
}

export const Small: Story = {
  args: { children: 'Small', size: 'sm' },
}

export const Large: Story = {
  args: { children: 'Large', size: 'lg' },
}

export const Disabled: Story = {
  args: { children: 'Disabled', disabled: true },
}

export const Destructive: Story = {
  args: { children: 'Delete', variant: 'destructive' },
}

export const Loading: Story = {
  args: { children: 'Saving...', loading: true },
}

export const AsChildLink: Story = {
  render: (args) => (
    <Button {...args} asChild>
      <a href="#anchor">Go to link</a>
    </Button>
  ),
  args: { variant: 'outline' },
}

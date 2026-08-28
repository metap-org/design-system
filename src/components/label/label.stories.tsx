import type { Meta, StoryObj } from '@storybook/react'
import { Label } from './label'

const meta: Meta<typeof Label> = {
  title: 'Components/Label',
  component: Label,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Label>

export const Default: Story = {
  args: { children: 'Email address', htmlFor: 'email' },
}

export const Required: Story = {
  args: { children: 'Email address', htmlFor: 'email', required: true },
}

export const WithControl: Story = {
  render: () => (
    <div className="flex flex-col gap-1">
      <Label htmlFor="story-email" required>
        Email address
      </Label>
      <input id="story-email" className="h-10 rounded-md border border-input px-md text-sm" />
    </div>
  ),
}

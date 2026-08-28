import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from './textarea'

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  args: { placeholder: 'Type a message...' },
}

export const WithLabel: Story = {
  args: { label: 'Notes', placeholder: 'Add any notes' },
}

export const WithError: Story = {
  args: { label: 'Notes', error: 'Notes are required' },
}

export const WithHelperText: Story = {
  args: { label: 'Notes', helperText: 'Max 500 characters' },
}

export const Disabled: Story = {
  args: { label: 'Notes', disabled: true, value: 'Cannot edit this' },
}

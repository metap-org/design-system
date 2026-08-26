import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './input'

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: { placeholder: 'Enter text...' },
}

export const WithLabel: Story = {
  args: { label: 'Email', placeholder: 'you@example.com' },
}

export const WithError: Story = {
  args: { label: 'Email', defaultValue: 'invalid', error: 'Please enter a valid email address' },
}

export const WithHelperText: Story = {
  args: { label: 'Password', type: 'password', helperText: 'Must be at least 8 characters' },
}

export const Disabled: Story = {
  args: { label: 'Disabled', defaultValue: 'Cannot edit', disabled: true },
}

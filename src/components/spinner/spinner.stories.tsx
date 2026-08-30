import type { Meta, StoryObj } from '@storybook/react'
import { Spinner } from './spinner'

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: { size: { control: 'select', options: ['sm', 'default', 'lg'] } },
}

export default meta
type Story = StoryObj<typeof Spinner>

export const Default: Story = { args: {} }
export const Small: Story = { args: { size: 'sm' } }
export const Large: Story = { args: { size: 'lg' } }

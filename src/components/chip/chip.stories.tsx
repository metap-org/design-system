import type { Meta, StoryObj } from '@storybook/react'
import { Chip } from './chip'

const meta: Meta<typeof Chip> = {
  title: 'Components/Chip',
  component: Chip,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'secondary', 'destructive', 'outline'] },
  },
}

export default meta
type Story = StoryObj<typeof Chip>

export const Default: Story = { args: { label: 'React', variant: 'default' } }
export const Secondary: Story = { args: { label: 'TypeScript', variant: 'secondary' } }
export const Destructive: Story = { args: { label: 'Error', variant: 'destructive' } }
export const Outline: Story = { args: { label: 'Tag', variant: 'outline' } }
export const WithClose: Story = { args: { label: 'Closeable', onClose: () => {} } }

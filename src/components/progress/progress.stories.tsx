import type { Meta, StoryObj } from '@storybook/react'
import { Progress } from './progress'

const meta: Meta<typeof Progress> = {
  title: 'Components/Progress',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Progress>

export const Default: Story = {
  render: () => <Progress value={40} className="w-64" />,
}

export const Complete: Story = {
  render: () => <Progress value={100} className="w-64" />,
}

export const Empty: Story = {
  render: () => <Progress value={0} className="w-64" />,
}

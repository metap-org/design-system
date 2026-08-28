import type { Meta, StoryObj } from '@storybook/react'
import { Skeleton } from './skeleton'

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Skeleton>

export const TextLine: Story = {
  render: () => <Skeleton className="h-4 w-48" />,
}

export const Avatar: Story = {
  render: () => <Skeleton className="h-12 w-12 rounded-full" />,
}

export const CardPreview: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  ),
}

import type { Meta, StoryObj } from '@storybook/react'
import { BarChart } from './bar-chart'

const meta: Meta<typeof BarChart> = {
  title: 'Components/BarChart',
  component: BarChart,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof BarChart>

export const Default: Story = {
  args: {
    data: [
      { label: 'Todo', value: 8 },
      { label: 'In Progress', value: 5 },
      { label: 'Done', value: 12 },
    ],
    ariaLabel: 'Issues by status',
  },
}

export const PerBarColor: Story = {
  args: {
    data: [
      { label: 'Low', value: 4, color: 'hsl(var(--muted-foreground))' },
      { label: 'Medium', value: 9, color: 'hsl(var(--primary))' },
      { label: 'High', value: 3, color: 'hsl(var(--destructive))' },
    ],
    ariaLabel: 'Issues by priority',
  },
}

export const SingleBar: Story = {
  args: {
    data: [{ label: 'Open', value: 1 }],
  },
}

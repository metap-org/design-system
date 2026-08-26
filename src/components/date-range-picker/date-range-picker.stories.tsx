import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { DateRangePicker, type DateRange } from './date-range-picker'

const meta: Meta<typeof DateRangePicker> = {
  title: 'Components/DateRangePicker',
  component: DateRangePicker,
}
export default meta

type Story = StoryObj<typeof DateRangePicker>

export const Default: Story = {}

export const WithValue: Story = {
  args: {
    value: { from: new Date(2026, 7, 10), to: new Date(2026, 7, 25) },
  },
}

export const WithLabel: Story = {
  args: { label: 'Trip dates', placeholder: 'Select date range' },
}

export const WithError: Story = {
  args: { label: 'Date range', error: 'Please select a valid range' },
}

export const WithHelperText: Story = {
  args: { label: 'Date range', helperText: 'Select start and end dates' },
}

export const Disabled: Story = {
  args: { label: 'Date range', disabled: true },
}

function ControlledDemo() {
  const [value, setValue] = React.useState<DateRange | null>(null)
  return (
    <div className="flex flex-col gap-sm">
      <DateRangePicker
        value={value}
        onValueChange={setValue}
        label="Trip dates"
        placeholder="Pick a date range"
      />
      <p className="text-sm text-muted-foreground">
        From: <strong>{value?.from?.toLocaleDateString('en-US') ?? '—'}</strong>
        {' · '}
        To: <strong>{value?.to?.toLocaleDateString('en-US') ?? '—'}</strong>
      </p>
    </div>
  )
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
}

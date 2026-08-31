import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { DateTimePicker } from './date-time-picker'

const meta: Meta<typeof DateTimePicker> = {
  title: 'Components/DateTimePicker',
  component: DateTimePicker,
}
export default meta

type Story = StoryObj<typeof DateTimePicker>

export const Default: Story = {}

export const WithValue: Story = {
  args: { value: new Date(2026, 7, 25, 14, 30) },
}

export const WithLabel: Story = {
  args: { label: 'Scheduled at', placeholder: 'Select date & time' },
}

export const WithError: Story = {
  args: { label: 'Deadline', error: 'Please select a date & time' },
}

export const Disabled: Story = {
  args: { label: 'Scheduled at', disabled: true },
}

function ControlledDemo() {
  const [value, setValue] = React.useState<Date | null>(null)
  return (
    <div className="flex flex-col gap-sm">
      <DateTimePicker
        value={value}
        onValueChange={setValue}
        label="Scheduled at"
        placeholder="Pick a date & time"
      />
      <p className="text-sm text-muted-foreground">
        Selected: <strong>{value ? value.toLocaleString('en-US') : '—'}</strong>
      </p>
    </div>
  )
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
}

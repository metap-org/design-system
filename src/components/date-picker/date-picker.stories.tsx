import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { DatePicker } from './date-picker'

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
}
export default meta

type Story = StoryObj<typeof DatePicker>

export const Default: Story = {}

export const WithValue: Story = {
  args: { value: new Date(2026, 7, 25) },
}

export const WithLabel: Story = {
  args: { label: 'Date of birth', placeholder: 'Select date' },
}

export const WithError: Story = {
  args: { label: 'Date', error: 'Please select a date' },
}

export const WithHelperText: Story = {
  args: { label: 'Date', helperText: 'Choose a date from the calendar' },
}

export const Disabled: Story = {
  args: { label: 'Date', disabled: true },
}

function ControlledDemo() {
  const [value, setValue] = React.useState<Date | null>(null)
  return (
    <div className="flex flex-col gap-sm">
      <DatePicker value={value} onValueChange={setValue} label="Select date" placeholder="Pick a date" />
      <p className="text-sm text-muted-foreground">
        Selected:{' '}
        <strong>
          {value
            ? value.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : '—'}
        </strong>
      </p>
    </div>
  )
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
}

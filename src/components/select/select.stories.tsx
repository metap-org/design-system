import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { Select } from './select'

const OPTIONS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Durian (unavailable)', value: 'durian', disabled: true },
]

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  args: { options: OPTIONS },
}
export default meta

type Story = StoryObj<typeof Select>

export const Default: Story = {}

export const WithValue: Story = {
  args: { value: 'banana', onValueChange: () => {} },
}

export const WithLabel: Story = {
  args: { label: 'Favourite Fruit', placeholder: 'Pick one' },
}

export const WithError: Story = {
  args: { label: 'Fruit', error: 'Selection is required' },
}

export const WithHelperText: Story = {
  args: { label: 'Fruit', helperText: 'Choose your favourite' },
}

export const Disabled: Story = {
  args: { disabled: true },
}

function ControlledDemo() {
  const [value, setValue] = React.useState('')
  return (
    <Select options={OPTIONS} value={value} onValueChange={setValue} label="Fruit" placeholder="Select..." />
  )
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
}

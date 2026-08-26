import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from './checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const Unchecked: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(false)
    return <Checkbox checked={checked} onCheckedChange={setChecked} label="Accept terms and conditions" />
  },
}

export const Checked: Story = {
  args: { checked: true, label: 'Selected option' },
}

export const Indeterminate: Story = {
  args: { indeterminate: true, label: 'Partial selection' },
}

export const Disabled: Story = {
  args: { disabled: true, label: 'Cannot change this' },
}

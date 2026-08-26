import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { RadioGroup, RadioGroupItem } from './radio-group'

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState('option1')
    return (
      <RadioGroup value={value} onValueChange={setValue}>
        <RadioGroupItem value="option1" label="Option 1" />
        <RadioGroupItem value="option2" label="Option 2" />
        <RadioGroupItem value="option3" label="Option 3" />
      </RadioGroup>
    )
  },
}

export const WithDisabledItem: Story = {
  render: () => {
    const [value, setValue] = React.useState('option1')
    return (
      <RadioGroup value={value} onValueChange={setValue}>
        <RadioGroupItem value="option1" label="Available" />
        <RadioGroupItem value="option2" label="Unavailable (disabled)" disabled />
        <RadioGroupItem value="option3" label="Also available" />
      </RadioGroup>
    )
  },
}

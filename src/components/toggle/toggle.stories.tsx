import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Toggle } from './toggle'

const meta: Meta<typeof Toggle> = {
  title: 'Components/Toggle',
  component: Toggle,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md'] },
  },
}

export default meta
type Story = StoryObj<typeof Toggle>

function OffDemo() {
  const [checked, setChecked] = React.useState(false)
  return <Toggle checked={checked} onCheckedChange={setChecked} label="Enable notifications" />
}

export const Off: Story = {
  render: () => <OffDemo />,
}

function OnDemo() {
  const [checked, setChecked] = React.useState(true)
  return <Toggle checked={checked} onCheckedChange={setChecked} label="Dark mode" />
}

export const On: Story = {
  render: () => <OnDemo />,
}

function SmallSizeDemo() {
  const [checked, setChecked] = React.useState(true)
  return <Toggle checked={checked} onCheckedChange={setChecked} label="Small toggle" size="sm" />
}

export const SmallSize: Story = {
  render: () => <SmallSizeDemo />,
}

export const Disabled: Story = {
  args: { checked: false, disabled: true, label: 'Cannot change' },
}

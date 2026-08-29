import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { MultiSelect } from './multi-select'

const OPTIONS = [
  { label: 'Name', value: 'name' },
  { label: 'Email', value: 'email' },
  { label: 'Status', value: 'status' },
  { label: 'Created at', value: 'createdAt' },
]

const meta: Meta<typeof MultiSelect> = {
  title: 'Components/MultiSelect',
  component: MultiSelect,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof MultiSelect>

function Controlled(props: Partial<React.ComponentProps<typeof MultiSelect>>) {
  const [value, setValue] = React.useState<string[]>(props.value ?? [])
  return (
    <div className="w-80">
      <MultiSelect options={OPTIONS} {...props} value={value} onChange={setValue} />
    </div>
  )
}

export const Default: Story = {
  render: () => <Controlled />,
}

export const WithSelection: Story = {
  render: () => <Controlled value={['name', 'status']} />,
}

export const WithLabel: Story = {
  render: () => <Controlled label="List view fields" value={['name']} />,
}

export const AllSelected: Story = {
  render: () => <Controlled value={OPTIONS.map((o) => o.value)} />,
}

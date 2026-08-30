import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { TagsInput } from './tags-input'

const meta: Meta<typeof TagsInput> = {
  title: 'Components/TagsInput',
  component: TagsInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TagsInput>

function Controlled(props: Partial<React.ComponentProps<typeof TagsInput>>) {
  const [value, setValue] = React.useState<string[]>(props.value ?? [])
  return (
    <div className="w-80">
      <TagsInput {...props} value={value} onChange={setValue} />
    </div>
  )
}

export const Default: Story = {
  render: () => <Controlled placeholder="Type a role and press Enter" />,
}

export const WithInitialTags: Story = {
  render: () => <Controlled value={['admin', 'editor']} />,
}

export const WithSuggestions: Story = {
  render: () => (
    <Controlled
      value={['admin']}
      suggestions={['admin', 'editor', 'viewer', 'ops']}
      placeholder="Type a role and press Enter"
    />
  ),
}

export const WithLabelAndHelperText: Story = {
  render: () => <Controlled label="Roles" helperText="Click a suggested role or type your own." />,
}

export const WithError: Story = {
  render: () => <Controlled label="Roles" error="At least one role is required." />,
}

export const Disabled: Story = {
  render: () => <Controlled value={['admin']} disabled />,
}

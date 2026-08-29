import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { SuggestInput } from './suggest-input'

const meta: Meta<typeof SuggestInput> = {
  title: 'Components/SuggestInput',
  component: SuggestInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SuggestInput>

function Controlled(props: Partial<React.ComponentProps<typeof SuggestInput>>) {
  const [value, setValue] = React.useState(props.value ?? '')
  return (
    <div className="w-80">
      <SuggestInput {...props} value={value} onChange={setValue} />
    </div>
  )
}

export const Default: Story = {
  render: () => <Controlled placeholder="Type a context attribute" />,
}

export const WithSuggestions: Story = {
  render: () => (
    <Controlled
      placeholder="Type a context attribute"
      suggestions={['tenantId', 'userId', 'roles', 'functionId']}
    />
  ),
}

export const WithLabel: Story = {
  render: () => <Controlled label="Attribute" suggestions={['tenantId', 'userId']} />,
}

import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { Autocomplete } from './autocomplete'

const FRUITS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Durian (unavailable)', value: 'durian', disabled: true },
  { label: 'Elderberry', value: 'elderberry' },
  { label: 'Fig', value: 'fig' },
  { label: 'Grape', value: 'grape' },
]

const meta: Meta<typeof Autocomplete> = {
  title: 'Components/Autocomplete',
  component: Autocomplete,
  args: { options: FRUITS },
}
export default meta

type Story = StoryObj<typeof Autocomplete>

export const Default: Story = {}

export const WithLabel: Story = {
  args: { label: 'Favourite Fruit', placeholder: 'Type to search...' },
}

export const WithError: Story = {
  args: { label: 'Fruit', error: 'Please select a fruit' },
}

export const WithHelperText: Story = {
  args: { label: 'Fruit', helperText: 'Start typing to filter results' },
}

export const Disabled: Story = {
  args: { label: 'Fruit', disabled: true },
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | null>(null)
    const [inputValue, setInputValue] = React.useState('')
    return (
      <div className="flex flex-col gap-sm">
        <Autocomplete
          options={FRUITS}
          value={value ?? undefined}
          onValueChange={v => setValue(v)}
          inputValue={inputValue}
          onInputChange={setInputValue}
          label="Fruit"
          placeholder="Type to search..."
        />
        <p className="text-sm text-muted-foreground">
          Selected value: <strong>{value ?? '—'}</strong>
        </p>
      </div>
    )
  },
}

export const AsyncSearch: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | null>(null)
    const onSearch = async (query: string) => {
      await new Promise(r => setTimeout(r, 400))
      return FRUITS.filter(f => f.label.toLowerCase().includes(query.toLowerCase()))
    }
    return (
      <div className="flex flex-col gap-sm">
        <Autocomplete
          onSearch={onSearch}
          value={value ?? undefined}
          onValueChange={setValue}
          label="Fruit (async)"
          placeholder="Type to search..."
        />
        <p className="text-sm text-muted-foreground">
          Selected value: <strong>{value ?? '—'}</strong>
        </p>
      </div>
    )
  },
}

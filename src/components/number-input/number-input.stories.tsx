import type { Meta, StoryObj } from '@storybook/react'
import { NumberInput } from './number-input'

const meta: Meta<typeof NumberInput> = {
  title: 'Components/NumberInput',
  component: NumberInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof NumberInput>

export const Default: Story = {
  args: { label: 'Số lượng', defaultValue: 1 },
}

export const WithMinMax: Story = {
  args: { label: 'Số lượng', defaultValue: 1, min: 0, max: 10 },
}

export const WithStep: Story = {
  args: { label: 'Giá (nghìn đồng)', defaultValue: 0, step: 5 },
}

export const WithError: Story = {
  args: { label: 'Số lượng', error: 'Số lượng phải lớn hơn 0' },
}

export const Disabled: Story = {
  args: { label: 'Số lượng', defaultValue: 1, disabled: true },
}

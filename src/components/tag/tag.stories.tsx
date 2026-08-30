import type { Meta, StoryObj } from '@storybook/react'
import { Tag } from './tag'

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['gray', 'blue', 'green', 'yellow', 'red', 'purple'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Tag>

export const Default: Story = { args: { label: 'Khác', color: 'gray' } }
export const Blue: Story = { args: { label: 'Món chính', color: 'blue' } }
export const Green: Story = { args: { label: 'Rau củ', color: 'green' } }
export const Yellow: Story = { args: { label: 'Khuyến mãi', color: 'yellow' } }
export const Red: Story = { args: { label: 'Hết hàng', color: 'red' } }
export const Purple: Story = { args: { label: 'VIP', color: 'purple' } }

export const CategoryList: Story = {
  render: () => (
    <div className="flex gap-2">
      <Tag label="Món chính" color="blue" />
      <Tag label="Rau củ" color="green" />
      <Tag label="Khuyến mãi" color="yellow" />
    </div>
  ),
}

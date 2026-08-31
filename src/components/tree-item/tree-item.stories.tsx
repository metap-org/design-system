import type { Meta, StoryObj } from '@storybook/react'
import { TreeItem } from './tree-item'

const meta: Meta<typeof TreeItem> = {
  title: 'Components/TreeItem',
  component: TreeItem,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof TreeItem>

export const Root: Story = {
  args: { depth: 0, children: 'Root node' },
}

export const NestedOnce: Story = {
  args: { depth: 1, children: 'Nested one level' },
}

export const RecursiveExample: Story = {
  render: () => (
    <TreeItem depth={0}>
      <p className="text-sm">Group: ALL</p>
      <TreeItem depth={1}>
        <p className="text-sm">status = active</p>
      </TreeItem>
      <TreeItem depth={1}>
        <p className="text-sm">Group: ANY</p>
        <TreeItem depth={2}>
          <p className="text-sm">role = admin</p>
        </TreeItem>
        <TreeItem depth={2}>
          <p className="text-sm">role = owner</p>
        </TreeItem>
      </TreeItem>
    </TreeItem>
  ),
}

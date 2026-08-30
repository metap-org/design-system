import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Pagination } from './pagination'

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Pagination>

export const Default: Story = {
  render: () => {
    function Demo() {
      const [page, setPage] = useState(1)
      return <Pagination page={page} totalPages={5} onPageChange={setPage} />
    }
    return <Demo />
  },
}

export const LargeRange: Story = {
  render: () => {
    function Demo() {
      const [page, setPage] = useState(10)
      return <Pagination page={page} totalPages={30} onPageChange={setPage} />
    }
    return <Demo />
  },
}

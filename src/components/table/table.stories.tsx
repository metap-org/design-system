import type { Meta, StoryObj } from '@storybook/react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from './table'
import { Badge } from '../badge/badge'

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Table>

const orders = [
  { id: '#1024', customer: 'Nguyễn Văn A', total: '245.000đ', status: 'success' as const, label: 'Hoàn thành' },
  { id: '#1025', customer: 'Trần Thị B', total: '120.000đ', status: 'warning' as const, label: 'Đang giao' },
  { id: '#1026', customer: 'Lê Văn C', total: '89.000đ', status: 'destructive' as const, label: 'Đã huỷ' },
]

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>Danh sách đơn hàng gần đây</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Mã đơn</TableHead>
          <TableHead>Khách hàng</TableHead>
          <TableHead>Tổng tiền</TableHead>
          <TableHead>Trạng thái</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map(order => (
          <TableRow key={order.id}>
            <TableCell>{order.id}</TableCell>
            <TableCell>{order.customer}</TableCell>
            <TableCell>{order.total}</TableCell>
            <TableCell>
              <Badge variant={order.status}>{order.label}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}

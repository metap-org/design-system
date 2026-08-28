import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card'
import { Button } from '../button/button'

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Đơn hàng #1024</CardTitle>
        <CardDescription>Cập nhật 5 phút trước</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">3 sản phẩm — tổng 245,000đ</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Xem chi tiết</Button>
      </CardFooter>
    </Card>
  ),
}

export const HeaderOnly: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Chỉ có header</CardTitle>
        <CardDescription>Không có content/footer</CardDescription>
      </CardHeader>
    </Card>
  ),
}

export const ContentOnly: Story = {
  render: () => (
    <Card className="w-80 p-md">
      <p className="text-sm">Card đơn giản, không dùng sub-component nào.</p>
    </Card>
  ),
}

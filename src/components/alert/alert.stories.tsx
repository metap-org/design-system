import type { Meta, StoryObj } from '@storybook/react'
import { Alert, AlertTitle, AlertDescription } from './alert'

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: { variant: { control: 'select', options: ['default', 'destructive'] } },
}

export default meta
type Story = StoryObj<typeof Alert>

export const Default: Story = {
  render: () => (
    <Alert className="w-96">
      <AlertTitle>Thông báo</AlertTitle>
      <AlertDescription>Đơn hàng của bạn đã được xác nhận.</AlertDescription>
    </Alert>
  ),
}

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="w-96">
      <AlertTitle>Lỗi</AlertTitle>
      <AlertDescription>Không thể lưu thay đổi, vui lòng thử lại.</AlertDescription>
    </Alert>
  ),
}

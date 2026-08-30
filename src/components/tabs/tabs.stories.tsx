import type { Meta, StoryObj } from '@storybook/react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Tabs>

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-80">
      <TabsList>
        <TabsTrigger value="account">Tài khoản</TabsTrigger>
        <TabsTrigger value="password">Mật khẩu</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Cập nhật thông tin tài khoản của bạn ở đây.</TabsContent>
      <TabsContent value="password">Đổi mật khẩu đăng nhập của bạn ở đây.</TabsContent>
    </Tabs>
  ),
}

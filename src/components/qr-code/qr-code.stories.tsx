import type { Meta, StoryObj } from '@storybook/react'
import { QrCode } from './qr-code'

const meta: Meta<typeof QrCode> = {
  title: 'Components/QrCode',
  component: QrCode,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof QrCode>

export const Default: Story = {
  args: { value: 'otpauth://totp/Metap:an@example.com?secret=JBSWY3DPEHPK3PXP&issuer=Metap' },
}

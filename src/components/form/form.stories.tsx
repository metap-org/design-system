import type { Meta, StoryObj } from '@storybook/react'
import { z } from 'zod'
import { Form } from './form'
import { FormField } from './form-field'
import { Button } from '../button/button'
import { patterns } from '../../lib/validators'

const meta: Meta<typeof Form> = {
  title: 'Components/Form',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Form>

const productSchema = z.object({
  name: z.string().min(2, 'Tên sản phẩm tối thiểu 2 ký tự').max(100),
  sku: z.string().regex(/^[A-Z0-9-]+$/, 'SKU chỉ gồm chữ hoa, số và dấu gạch ngang'),
  phone: z.string().regex(patterns.phoneVN, 'Số điện thoại không hợp lệ').optional(),
})

export const ProductForm: Story = {
  render: () => (
    <Form
      className="w-80 space-y-md"
      schema={productSchema}
      onSubmit={values => alert(JSON.stringify(values, null, 2))}
    >
      <FormField name="name" label="Tên sản phẩm" required maxLength={100} />
      <FormField name="sku" label="Mã SKU" />
      <FormField name="phone" label="Số điện thoại" />
      <Button type="submit">Lưu</Button>
    </Form>
  ),
}

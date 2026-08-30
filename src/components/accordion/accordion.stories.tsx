import type { Meta, StoryObj } from '@storybook/react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './accordion'

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Accordion>

export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-96">
      <AccordionItem value="item-1">
        <AccordionTrigger>Đơn hàng bao lâu thì giao?</AccordionTrigger>
        <AccordionContent>Thường giao trong 2-4 giờ trong nội thành.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Có thể đổi trả không?</AccordionTrigger>
        <AccordionContent>Đổi trả miễn phí trong vòng 7 ngày.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

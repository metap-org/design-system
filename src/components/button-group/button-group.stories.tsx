import type { Meta, StoryObj } from '@storybook/react'
import { ButtonGroup } from './button-group'
import { Button } from '../button/button'
import { IconButton } from '../icon-button/icon-button'

const meta: Meta<typeof ButtonGroup> = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'radio', options: ['horizontal', 'vertical'] },
  },
}

export default meta
type Story = StoryObj<typeof ButtonGroup>

export const Horizontal: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">Left</Button>
      <Button variant="outline">Middle</Button>
      <Button variant="outline">Right</Button>
    </ButtonGroup>
  ),
  args: { orientation: 'horizontal' },
}

export const Vertical: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">Top</Button>
      <Button variant="outline">Middle</Button>
      <Button variant="outline">Bottom</Button>
    </ButtonGroup>
  ),
  args: { orientation: 'vertical' },
}

export const IconButtons: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <IconButton variant="outline" aria-label="Bold" icon={<span>B</span>} />
      <IconButton variant="outline" aria-label="Italic" icon={<span>I</span>} />
      <IconButton variant="outline" aria-label="Underline" icon={<span>U</span>} />
    </ButtonGroup>
  ),
  args: { orientation: 'horizontal' },
}

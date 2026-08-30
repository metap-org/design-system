import type { Meta, StoryObj } from '@storybook/react'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './tooltip'
import { IconButton } from '../icon-button/icon-button'

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
)

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <IconButton icon={<InfoIcon />} aria-label="Thông tin" variant="ghost" />
        </TooltipTrigger>
        <TooltipContent>Thêm thông tin ở đây</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}

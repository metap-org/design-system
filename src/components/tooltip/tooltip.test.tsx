import * as React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './tooltip'

function renderTooltip() {
  return render(
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger>Hover tôi</TooltipTrigger>
        <TooltipContent>Nội dung gợi ý</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

describe('Tooltip', () => {
  it('is hidden until hovered', () => {
    renderTooltip()
    expect(screen.queryByText('Nội dung gợi ý')).not.toBeInTheDocument()
  })

  it('shows content on hover', async () => {
    const user = userEvent.setup()
    renderTooltip()
    await user.hover(screen.getByText('Hover tôi'))
    expect(await screen.findByText('Nội dung gợi ý')).toBeInTheDocument()
  })

  it('hides content on Escape', async () => {
    // Radix Tooltip tracks real pointer movement toward the content to decide whether a
    // hover-out should close it, which jsdom's zero-size layout can't simulate reliably —
    // Escape is the deterministic way to verify closing behavior here.
    const user = userEvent.setup()
    renderTooltip()
    await user.hover(screen.getByText('Hover tôi'))
    await screen.findByText('Nội dung gợi ý')
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByText('Nội dung gợi ý')).not.toBeInTheDocument())
  })
})

import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './accordion'

function renderAccordion() {
  return render(
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Câu hỏi 1</AccordionTrigger>
        <AccordionContent>Trả lời 1</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Câu hỏi 2</AccordionTrigger>
        <AccordionContent>Trả lời 2</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

describe('Accordion', () => {
  it('all items collapsed by default', () => {
    renderAccordion()
    expect(screen.queryByText('Trả lời 1')).not.toBeInTheDocument()
  })

  it('expands an item on trigger click', async () => {
    renderAccordion()
    await userEvent.click(screen.getByRole('button', { name: 'Câu hỏi 1' }))
    expect(screen.getByText('Trả lời 1')).toBeVisible()
  })

  it('collapses the previously open item when type="single" (default, non-collapsible-across-items)', async () => {
    renderAccordion()
    await userEvent.click(screen.getByRole('button', { name: 'Câu hỏi 1' }))
    await userEvent.click(screen.getByRole('button', { name: 'Câu hỏi 2' }))
    expect(screen.queryByText('Trả lời 1')).not.toBeInTheDocument()
    expect(screen.getByText('Trả lời 2')).toBeVisible()
  })

  it('collapses an open item on second click (collapsible)', async () => {
    renderAccordion()
    await userEvent.click(screen.getByRole('button', { name: 'Câu hỏi 1' }))
    await userEvent.click(screen.getByRole('button', { name: 'Câu hỏi 1' }))
    expect(screen.queryByText('Trả lời 1')).not.toBeInTheDocument()
  })

  it('exposes aria-expanded on the trigger', async () => {
    renderAccordion()
    const trigger = screen.getByRole('button', { name: 'Câu hỏi 1' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })
})

import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Stepper, StepperGroup, StepperItem, StepperConnector } from './stepper'

function renderStepper() {
  return render(
    <Stepper>
      <StepperGroup>
        <StepperItem>pending</StepperItem>
      </StepperGroup>
      <StepperConnector />
      <StepperGroup>
        <StepperItem variant="current">active</StepperItem>
      </StepperGroup>
      <StepperConnector />
      <StepperGroup>
        <StepperItem variant="terminal">suspended</StepperItem>
      </StepperGroup>
    </Stepper>
  )
}

describe('Stepper', () => {
  it('renders as a list', () => {
    renderStepper()
    expect(screen.getByRole('list')).toBeInTheDocument()
  })

  it('renders every step as a listitem', () => {
    renderStepper()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('renders step labels', () => {
    renderStepper()
    expect(screen.getByText('pending')).toBeInTheDocument()
    expect(screen.getByText('active')).toBeInTheDocument()
    expect(screen.getByText('suspended')).toBeInTheDocument()
  })

  it('hides connectors from assistive tech', () => {
    renderStepper()
    const connectors = document.querySelectorAll('[aria-hidden="true"]')
    expect(connectors.length).toBeGreaterThanOrEqual(2)
  })

  it('marks the current step visually distinct from a plain step', () => {
    renderStepper()
    const current = screen.getByText('active');
    const plain = screen.getByText('pending');
    expect(current.className).not.toBe(plain.className)
  })
})

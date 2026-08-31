import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ButtonGroup } from './button-group'
import { Button } from '../button/button'

describe('ButtonGroup', () => {
  it('renders children', () => {
    render(
      <ButtonGroup>
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>
    )
    expect(screen.getByText('One')).toBeInTheDocument()
    expect(screen.getByText('Two')).toBeInTheDocument()
  })

  it('has role="group" by default', () => {
    render(
      <ButtonGroup>
        <Button>One</Button>
      </ButtonGroup>
    )
    expect(screen.getByRole('group')).toBeInTheDocument()
  })

  it('allows overriding role (e.g. toolbar)', () => {
    render(
      <ButtonGroup role="toolbar">
        <Button>One</Button>
      </ButtonGroup>
    )
    expect(screen.getByRole('toolbar')).toBeInTheDocument()
    expect(screen.queryByRole('group')).toBeNull()
  })

  it('applies horizontal orientation classes by default', () => {
    const { container } = render(
      <ButtonGroup>
        <Button>One</Button>
      </ButtonGroup>
    )
    expect(container.firstChild).toHaveClass('flex-row')
  })

  it('applies vertical orientation classes', () => {
    const { container } = render(
      <ButtonGroup orientation="vertical">
        <Button>One</Button>
      </ButtonGroup>
    )
    expect(container.firstChild).toHaveClass('flex-col')
  })

  it('merges custom className', () => {
    const { container } = render(
      <ButtonGroup className="custom-class">
        <Button>One</Button>
      </ButtonGroup>
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <ButtonGroup ref={ref}>
        <Button>One</Button>
      </ButtonGroup>
    )
    expect(ref.current?.tagName).toBe('DIV')
  })
})

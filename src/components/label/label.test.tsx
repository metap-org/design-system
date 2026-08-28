import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Label } from './label'

describe('Label', () => {
  it('renders children', () => {
    render(<Label htmlFor="field">Name</Label>)
    expect(screen.getByText('Name')).toBeInTheDocument()
  })

  it('associates with a control via htmlFor', () => {
    render(
      <>
        <Label htmlFor="field">Name</Label>
        <input id="field" />
      </>
    )
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
  })

  it('renders a required marker when required', () => {
    render(<Label required>Name</Label>)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('does not render a required marker by default', () => {
    render(<Label>Name</Label>)
    expect(screen.queryByText('*')).not.toBeInTheDocument()
  })

  it('merges custom className', () => {
    render(<Label className="extra-class">Name</Label>)
    expect(screen.getByText('Name')).toHaveClass('extra-class')
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLLabelElement>()
    render(<Label ref={ref}>Name</Label>)
    expect(ref.current).not.toBeNull()
    expect(ref.current?.tagName).toBe('LABEL')
  })
})

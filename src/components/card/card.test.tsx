import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>content</Card>)
    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('applies base card classes', () => {
    const { container } = render(<Card>content</Card>)
    expect(container.firstChild).toHaveClass('rounded-lg')
    expect(container.firstChild).toHaveClass('border-border')
  })

  it('merges custom className', () => {
    const { container } = render(<Card className="custom-class">content</Card>)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Card ref={ref}>content</Card>)
    expect(ref.current?.tagName).toBe('DIV')
  })

  it('renders full composition (header/title/description/content/footer)', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    )
    expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByText('Body')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('CardTitle renders as an h3 heading', () => {
    render(<CardTitle>Heading</CardTitle>)
    expect(screen.getByRole('heading', { level: 3, name: 'Heading' })).toBeInTheDocument()
  })
})

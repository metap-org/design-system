import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Alert, AlertTitle, AlertDescription } from './alert'

describe('Alert', () => {
  it('renders with role="alert"', () => {
    render(<Alert>Nội dung</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('applies default variant classes', () => {
    render(<Alert>Nội dung</Alert>)
    expect(screen.getByRole('alert')).toHaveClass('border-border')
  })

  it('applies destructive variant classes', () => {
    render(<Alert variant="destructive">Lỗi</Alert>)
    expect(screen.getByRole('alert')).toHaveClass('text-destructive')
  })

  it('renders title and description', () => {
    render(
      <Alert>
        <AlertTitle>Thành công</AlertTitle>
        <AlertDescription>Đã lưu thay đổi.</AlertDescription>
      </Alert>
    )
    expect(screen.getByText('Thành công')).toBeInTheDocument()
    expect(screen.getByText('Đã lưu thay đổi.')).toBeInTheDocument()
  })

  it('merges custom className', () => {
    render(<Alert className="custom-class">x</Alert>)
    expect(screen.getByRole('alert')).toHaveClass('custom-class')
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Alert ref={ref}>x</Alert>)
    expect(ref.current?.tagName).toBe('DIV')
  })
})

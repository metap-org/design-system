import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { QrCode, qrPath } from './qr-code'

describe('QrCode', () => {
  it('renders an accessible svg of the requested size', () => {
    render(<QrCode value="otpauth://totp/Acme:a@example.com?secret=JBSWY3DPEHPK3PXP" label="Mã QR" size={160} />)
    const svg = screen.getByRole('img', { name: 'Mã QR' })
    expect(svg).toHaveAttribute('width', '160')
    expect(svg.querySelector('path')?.getAttribute('d')).toMatch(/^M\d+ \d+h1v1h-1z/)
  })

  it('grows with the data and keeps a 4-module quiet zone', () => {
    const short = qrPath('hi')
    const long = qrPath('x'.repeat(120))
    expect(short.extent).toBe(21 + 8)
    expect(long.extent).toBeGreaterThan(short.extent)
  })
})

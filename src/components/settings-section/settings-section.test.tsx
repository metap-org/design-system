import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SettingsRow, SettingsSection } from './settings-section'
import { StickyActionBar } from '../sticky-action-bar'

describe('SettingsSection', () => {
  it('renders the heading, rows and a label tied to its control', () => {
    render(
      <SettingsSection title="Đăng nhập" description="Áp dụng cho mọi thành viên">
        <SettingsRow label="Độ dài mật khẩu" description="8 đến 128" htmlFor="len">
          <input id="len" />
        </SettingsRow>
      </SettingsSection>
    )
    expect(screen.getByRole('heading', { name: 'Đăng nhập' })).toBeInTheDocument()
    expect(screen.getByLabelText('Độ dài mật khẩu')).toHaveAttribute('id', 'len')
    expect(screen.getByText('8 đến 128')).toBeInTheDocument()
  })
})

describe('SettingsRow', () => {
  it('stretches the first control of a wide row', () => {
    render(
      <SettingsRow label="Tên" controlWidth="wide">
        <input aria-label="Tên" />
        <button>Lưu</button>
      </SettingsRow>
    )
    const control = screen.getByRole('button', { name: 'Lưu' }).parentElement
    expect(control?.className).toContain('[&>:first-child]:flex-1')
  })
})

describe('StickyActionBar', () => {
  it('shows only while visible', () => {
    const { rerender } = render(<StickyActionBar visible={false} message="1 thay đổi" />)
    expect(screen.queryByText('1 thay đổi')).not.toBeInTheDocument()
    rerender(<StickyActionBar visible message="1 thay đổi" />)
    expect(screen.getByText('1 thay đổi')).toBeInTheDocument()
  })
})

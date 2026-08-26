// src/components/toast/toast.test.tsx
import * as React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { toast, ToastProvider } from './toast'

// Helper: render with provider
function renderWithProvider(ui?: React.ReactNode) {
  return render(<ToastProvider>{ui ?? <div />}</ToastProvider>)
}

describe('toast / ToastProvider', () => {
  it('renders children without crashing', () => {
    renderWithProvider(<span>Child</span>)
    expect(screen.getByText('Child')).toBeInTheDocument()
  })

  it('shows a toast message when toast() is called', async () => {
    renderWithProvider()
    act(() => { toast('Hello world') })
    await screen.findByRole('alert')
    expect(screen.getByRole('alert')).toHaveTextContent('Hello world')
  })

  it('shows multiple toasts', async () => {
    renderWithProvider()
    act(() => {
      toast('First')
      toast('Second')
    })
    const alerts = await screen.findAllByRole('alert')
    expect(alerts).toHaveLength(2)
    expect(alerts[0]).toHaveTextContent('First')
    expect(alerts[1]).toHaveTextContent('Second')
  })

  it('renders default variant with background classes', async () => {
    renderWithProvider()
    act(() => { toast('Info') })
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveClass('bg-background')
  })

  it('renders destructive variant', async () => {
    renderWithProvider()
    act(() => { toast('Error!', { variant: 'destructive' }) })
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveClass('bg-destructive')
  })

  it('dismisses toast when dismiss button is clicked', async () => {
    renderWithProvider()
    act(() => { toast('Dismissable', { duration: 0 }) })
    await screen.findByRole('alert')
    const dismissBtn = screen.getByRole('button', { name: /dismiss/i })
    await userEvent.click(dismissBtn)
    await waitFor(() => {
      expect(screen.queryByRole('alert')).toBeNull()
    })
  })

  it('auto-dismisses after duration ms', async () => {
    vi.useFakeTimers()
    renderWithProvider()
    act(() => { toast('Auto', { duration: 1000 }) })
    await screen.findByRole('alert')
    act(() => { vi.advanceTimersByTime(1100) })
    await waitFor(() => {
      expect(screen.queryByRole('alert')).toBeNull()
    })
    vi.useRealTimers()
  })

  it('does not auto-dismiss when duration is 0', async () => {
    vi.useFakeTimers()
    renderWithProvider()
    act(() => { toast('Sticky', { duration: 0 }) })
    await screen.findByRole('alert')
    act(() => { vi.advanceTimersByTime(10000) })
    expect(screen.getByRole('alert')).toBeInTheDocument()
    vi.useRealTimers()
  })

  it('toast() has no effect when no provider is mounted', () => {
    // Should not throw
    expect(() => toast('No provider')).not.toThrow()
  })
})

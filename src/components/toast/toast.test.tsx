// src/components/toast/toast.test.tsx
import * as React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
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

  it('auto-dismisses after duration ms', () => {
    // `toast()` updates state synchronously (a plain listener callback, not a Promise/timer
    // chain), so the DOM is already current by the time each `act()` call returns — asserting
    // synchronously (`getByRole`/`queryByRole`) instead of `findByRole`/`waitFor` avoids relying
    // on their internal setTimeout/setInterval polling, which fake timers pause indefinitely
    // (component-status.md's Toast row: "not a bug in the component, a fake-timer test issue").
    vi.useFakeTimers()
    renderWithProvider()
    act(() => { toast('Auto', { duration: 1000 }) })
    expect(screen.getByRole('alert')).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(1100) })
    expect(screen.queryByRole('alert')).toBeNull()
    vi.useRealTimers()
  })

  it('does not auto-dismiss when duration is 0', () => {
    vi.useFakeTimers()
    renderWithProvider()
    act(() => { toast('Sticky', { duration: 0 }) })
    expect(screen.getByRole('alert')).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(10000) })
    expect(screen.getByRole('alert')).toBeInTheDocument()
    vi.useRealTimers()
  })

  it('toast() has no effect when no provider is mounted', () => {
    // Should not throw
    expect(() => toast('No provider')).not.toThrow()
  })
})

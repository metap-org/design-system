// src/components/toast/toast.tsx
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { cn } from '../../lib/utils'

export type ToastVariant = 'default' | 'destructive'

export interface ToastEntry {
  id: string
  message: string
  variant: ToastVariant
  duration: number
}

const listeners = new Set<(t: ToastEntry) => void>()
let _counter = 0

export function toast(
  message: string,
  opts?: { variant?: ToastVariant; duration?: number }
): void {
  const entry: ToastEntry = {
    id: String(++_counter),
    message,
    variant: opts?.variant ?? 'default',
    duration: opts?.duration ?? 4000,
  }
  listeners.forEach(l => l(entry))
}

interface ToastItemProps extends ToastEntry {
  onDismiss: () => void
}

function ToastItem({ message, variant, duration, onDismiss }: ToastItemProps) {
  React.useEffect(() => {
    if (duration <= 0) return
    const timer = setTimeout(onDismiss, duration)
    return () => clearTimeout(timer)
  }, [duration, onDismiss])

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={cn(
        'flex items-start justify-between gap-md rounded-md border px-md py-sm shadow-lg',
        'min-w-64 max-w-sm text-sm',
        variant === 'default' && 'border-border bg-background text-foreground',
        variant === 'destructive' &&
          'border-destructive bg-destructive text-destructive-foreground'
      )}
    >
      <span className="flex-1">{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className={cn(
          'shrink-0 opacity-70 hover:opacity-100',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1'
        )}
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M4 4l8 8M12 4l-8 8" />
        </svg>
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastEntry[]>([])

  React.useEffect(() => {
    const handler = (t: ToastEntry) => setToasts(prev => [...prev, t])
    listeners.add(handler)
    return () => {
      listeners.delete(handler)
    }
  }, [])

  const dismiss = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <>
      {children}
      {typeof document !== 'undefined' &&
        ReactDOM.createPortal(
          <div
            aria-label="Notifications"
            className="fixed bottom-md right-md z-50 flex flex-col gap-sm"
          >
            {toasts.map(t => (
              <ToastItem key={t.id} {...t} onDismiss={() => dismiss(t.id)} />
            ))}
          </div>,
          document.body
        )}
    </>
  )
}

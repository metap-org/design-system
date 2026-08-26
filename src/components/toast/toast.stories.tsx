// src/components/toast/toast.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { toast, ToastProvider } from './toast'

const meta: Meta = {
  title: 'Components/Toast',
  decorators: [
    Story => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <button
      type="button"
      className="rounded-md bg-primary px-md py-sm text-sm text-primary-foreground"
      onClick={() => toast('File saved successfully')}
    >
      Show Toast
    </button>
  ),
}

export const Destructive: Story = {
  render: () => (
    <button
      type="button"
      className="rounded-md bg-destructive px-md py-sm text-sm text-destructive-foreground"
      onClick={() => toast('Something went wrong', { variant: 'destructive' })}
    >
      Show Error Toast
    </button>
  ),
}

export const Sticky: Story = {
  render: () => (
    <button
      type="button"
      className="rounded-md bg-primary px-md py-sm text-sm text-primary-foreground"
      onClick={() => toast('This toast stays until dismissed', { duration: 0 })}
    >
      Show Sticky Toast
    </button>
  ),
}

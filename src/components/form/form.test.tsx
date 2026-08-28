import * as React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { z } from 'zod'
import { Form } from './form'
import { FormField } from './form-field'

const schema = z.object({
  name: z.string().min(2, 'Tên tối thiểu 2 ký tự'),
})

describe('Form + FormField', () => {
  it('renders children inside a form element', () => {
    render(
      <Form schema={schema} onSubmit={vi.fn()}>
        <FormField name="name" label="Tên" />
      </Form>
    )
    expect(screen.getByLabelText('Tên')).toBeInTheDocument()
  })

  it('calls onSubmit with valid values', async () => {
    const handleSubmit = vi.fn()
    render(
      <Form schema={schema} onSubmit={handleSubmit}>
        <FormField name="name" label="Tên" />
        <button type="submit">Save</button>
      </Form>
    )
    await userEvent.type(screen.getByLabelText('Tên'), 'Alice')
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    await waitFor(() => expect(handleSubmit).toHaveBeenCalledWith({ name: 'Alice' }, expect.anything()))
  })

  it('shows the zod error message and does not call onSubmit when invalid', async () => {
    const handleSubmit = vi.fn()
    render(
      <Form schema={schema} onSubmit={handleSubmit}>
        <FormField name="name" label="Tên" />
        <button type="submit">Save</button>
      </Form>
    )
    await userEvent.type(screen.getByLabelText('Tên'), 'A')
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(await screen.findByText('Tên tối thiểu 2 ký tự')).toBeInTheDocument()
    expect(handleSubmit).not.toHaveBeenCalled()
  })

  it('applies destructive border class to the input when invalid', async () => {
    render(
      <Form schema={schema} onSubmit={vi.fn()}>
        <FormField name="name" label="Tên" />
        <button type="submit">Save</button>
      </Form>
    )
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(await screen.findByLabelText('Tên')).toHaveClass('border-destructive')
  })

  it('FormField renders without a label when none is given', () => {
    render(
      <Form schema={schema} onSubmit={vi.fn()}>
        <FormField name="name" />
      </Form>
    )
    expect(screen.queryByText('Tên')).not.toBeInTheDocument()
  })
})

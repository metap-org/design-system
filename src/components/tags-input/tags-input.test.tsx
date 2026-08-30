import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TagsInput } from './tags-input'

describe('TagsInput', () => {
  it('renders existing tags as chips', () => {
    render(<TagsInput value={['admin', 'editor']} onChange={() => {}} />)
    expect(screen.getByText('admin')).toBeInTheDocument()
    expect(screen.getByText('editor')).toBeInTheDocument()
  })

  it('commits a new tag on Enter', async () => {
    const onChange = vi.fn()
    render(<TagsInput value={['admin']} onChange={onChange} />)
    await userEvent.type(screen.getByRole('textbox'), 'viewer{enter}')
    expect(onChange).toHaveBeenCalledWith(['admin', 'viewer'])
  })

  it('commits a new tag on comma', async () => {
    const onChange = vi.fn()
    render(<TagsInput value={[]} onChange={onChange} />)
    await userEvent.type(screen.getByRole('textbox'), 'viewer,')
    expect(onChange).toHaveBeenCalledWith(['viewer'])
  })

  it('does not add a duplicate tag', async () => {
    const onChange = vi.fn()
    render(<TagsInput value={['admin']} onChange={onChange} />)
    await userEvent.type(screen.getByRole('textbox'), 'admin{enter}')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('removes a tag when its chip close button is clicked', async () => {
    const onChange = vi.fn()
    render(<TagsInput value={['admin', 'editor']} onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Remove admin' }))
    expect(onChange).toHaveBeenCalledWith(['editor'])
  })

  it('removes the last tag on Backspace when draft is empty', async () => {
    const onChange = vi.fn()
    render(<TagsInput value={['admin', 'editor']} onChange={onChange} />)
    screen.getByRole('textbox').focus()
    await userEvent.keyboard('{Backspace}')
    expect(onChange).toHaveBeenCalledWith(['admin'])
  })

  it('renders suggestions not already in value', () => {
    render(
      <TagsInput
        value={['admin']}
        onChange={() => {}}
        suggestions={['admin', 'editor', 'viewer']}
      />
    )
    expect(screen.getByText('editor')).toBeInTheDocument()
    expect(screen.getByText('viewer')).toBeInTheDocument()
  })

  it('adds a suggestion when its chip is clicked', async () => {
    const onChange = vi.fn()
    render(<TagsInput value={['admin']} onChange={onChange} suggestions={['editor']} />)
    await userEvent.click(screen.getByText('editor'))
    expect(onChange).toHaveBeenCalledWith(['admin', 'editor'])
  })

  it('renders label linked to input', () => {
    render(<TagsInput value={[]} onChange={() => {}} label="Roles" />)
    expect(screen.getByRole('textbox')).toHaveAccessibleName('Roles')
  })

  it('renders error message with role=alert', () => {
    render(<TagsInput value={[]} onChange={() => {}} error="Required" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Required')
  })

  it('forwards ref to the text input', () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<TagsInput value={[]} onChange={() => {}} ref={ref} />)
    expect(ref.current?.tagName).toBe('INPUT')
  })
})

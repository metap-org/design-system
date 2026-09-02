import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { FileUpload } from './file-upload'

function makeFile(name: string, sizeBytes: number, type = 'text/plain') {
  return new File([new Uint8Array(sizeBytes)], name, { type })
}

function getFileInput(container: HTMLElement) {
  return container.querySelector('input[type="file"]') as HTMLInputElement
}

describe('FileUpload', () => {
  it('renders label and helper text', () => {
    render(<FileUpload label="Attachment" helperText="Up to 5 files" />)
    expect(screen.getByText('Attachment')).toBeInTheDocument()
    expect(screen.getByText('Up to 5 files')).toBeInTheDocument()
  })

  it('selecting a file via the picker calls onFilesChange', async () => {
    const onFilesChange = vi.fn()
    const { container } = render(<FileUpload onFilesChange={onFilesChange} />)
    const file = makeFile('report.pdf', 10, 'application/pdf')
    await userEvent.upload(getFileInput(container), file)
    expect(onFilesChange).toHaveBeenCalledWith([file])
  })

  it('dropping a file calls onFilesChange', () => {
    const onFilesChange = vi.fn()
    render(<FileUpload onFilesChange={onFilesChange} />)
    const file = makeFile('photo.png', 20, 'image/png')
    fireEvent.drop(screen.getByRole('button'), { dataTransfer: { files: [file] } })
    expect(onFilesChange).toHaveBeenCalledWith([file])
  })

  it('rejects a dropped file whose type does not match accept, without calling onFilesChange', () => {
    // `userEvent.upload` on an `<input accept>` mirrors the native OS file picker, which already
    // filters by `accept` before a mismatched file could ever reach this component's own
    // `matchesAccept` re-check — that re-check exists specifically for drag-and-drop, which
    // bypasses the picker's filtering entirely, so this test exercises `drop`, not the input.
    const onFilesChange = vi.fn()
    const onFileRejected = vi.fn()
    render(
      <FileUpload accept=".pdf" onFilesChange={onFilesChange} onFileRejected={onFileRejected} />
    )
    const file = makeFile('photo.png', 10, 'image/png')
    fireEvent.drop(screen.getByRole('button'), { dataTransfer: { files: [file] } })
    expect(onFilesChange).not.toHaveBeenCalled()
    expect(onFileRejected).toHaveBeenCalledWith({ file, reason: 'type' })
    expect(screen.getByRole('alert')).toHaveTextContent('not an accepted file type')
  })

  it('accepts a file matching an extension in accept', async () => {
    const onFilesChange = vi.fn()
    const { container } = render(<FileUpload accept=".pdf,.docx" onFilesChange={onFilesChange} />)
    const file = makeFile('report.PDF', 10, 'application/pdf')
    await userEvent.upload(getFileInput(container), file)
    expect(onFilesChange).toHaveBeenCalledWith([file])
  })

  it('rejects a file over maxSize', async () => {
    const onFilesChange = vi.fn()
    const onFileRejected = vi.fn()
    const { container } = render(
      <FileUpload maxSize={100} onFilesChange={onFilesChange} onFileRejected={onFileRejected} />
    )
    const file = makeFile('big.bin', 500)
    await userEvent.upload(getFileInput(container), file)
    expect(onFilesChange).not.toHaveBeenCalled()
    expect(onFileRejected).toHaveBeenCalledWith({ file, reason: 'size' })
    expect(screen.getByRole('alert')).toHaveTextContent('exceeds the maximum file size')
  })

  it('single-select mode keeps only the first accepted file, replacing the previous value', async () => {
    const onFilesChange = vi.fn()
    const existing = makeFile('old.txt', 5)
    const { container } = render(<FileUpload value={[existing]} onFilesChange={onFilesChange} />)
    const file = makeFile('new.txt', 5)
    await userEvent.upload(getFileInput(container), file)
    expect(onFilesChange).toHaveBeenCalledWith([file])
  })

  it('multiple mode appends to the existing value', async () => {
    const onFilesChange = vi.fn()
    const existing = makeFile('old.txt', 5)
    const { container } = render(
      <FileUpload multiple value={[existing]} onFilesChange={onFilesChange} />
    )
    const file = makeFile('new.txt', 5)
    await userEvent.upload(getFileInput(container), file)
    expect(onFilesChange).toHaveBeenCalledWith([existing, file])
  })

  it('lists selected files with a formatted size', () => {
    render(<FileUpload value={[makeFile('report.pdf', 2048)]} />)
    expect(screen.getByText('report.pdf')).toBeInTheDocument()
    expect(screen.getByText('2.0 KB')).toBeInTheDocument()
  })

  it('removing a file calls onFilesChange without it', async () => {
    const onFilesChange = vi.fn()
    const a = makeFile('a.txt', 5)
    const b = makeFile('b.txt', 5)
    render(<FileUpload multiple value={[a, b]} onFilesChange={onFilesChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Remove a.txt' }))
    expect(onFilesChange).toHaveBeenCalledWith([b])
  })

  it('does not open the picker or accept a drop when disabled', () => {
    const onFilesChange = vi.fn()
    render(<FileUpload disabled onFilesChange={onFilesChange} />)
    const dropzone = screen.getByRole('button')
    expect(dropzone).toHaveAttribute('aria-disabled', 'true')
    fireEvent.drop(dropzone, { dataTransfer: { files: [makeFile('x.txt', 5)] } })
    expect(onFilesChange).not.toHaveBeenCalled()
  })

  it('forwards ref to the dropzone element', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<FileUpload ref={ref} />)
    expect(ref.current).toHaveAttribute('role', 'button')
  })
})

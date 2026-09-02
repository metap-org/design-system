import * as React from 'react'
import { cn } from '../../lib/utils'

export type FileRejectionReason = 'type' | 'size'

export type FileRejection = { file: File; reason: FileRejectionReason }

/**
 * Click-to-browse + drag-and-drop file picker. Deliberately UI-only, same split the library's
 * `Form`/`FormField` already establish for validation (see `readme.md`'s "Spec chi tiết: Form
 * controls + validation props"): this component only enforces **HTML-level** constraints —
 * `accept` (MIME type / extension allow-list) and `maxSize` (byte ceiling) — the same two things
 * a native `<input type="file" accept=... />` already expresses, just re-checked here because
 * drag-and-drop bypasses the OS file picker's own filtering. It does **not** read file content —
 * no cert/signature verification, no spreadsheet-schema validation, no virus scanning. Content
 * validation belongs to the app (parsing the file after `onFilesChange`) or the backend
 * (`metap-attachments`' upload endpoint) — mixing that into a design-system atom would tie a
 * generic UI component to one business format, breaking the layering rule (`platform-ui`
 * composes, `design-system` never depends on app-specific parsing).
 *
 * Uncontrolled by itself (holds no file list) — the caller owns `value`/`onFilesChange`, matching
 * every other form control here (`Select`, `MultiSelect`, ...). Built to replace the raw,
 * unstyled `<input type="file">` found in `apps/jira-fe`'s `IssueDetailPage.tsx`
 * (`docs/component-status.md`'s FileUpload row) — a real, single-consumer gap today, ahead of a
 * second one, same order `metap-storage`/`metap-attachments` were themselves built in.
 */
export interface FileUploadProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange' | 'onClick' | 'onDrop' | 'onDragOver' | 'onDragLeave' | 'onKeyDown'
> {
  label?: string
  helperText?: string
  /** Native `accept` value (e.g. `".xlsx,.xls"`, `"image/*"`, `"application/pdf"`) — comma
   *  separated extensions and/or MIME types/patterns. Omit to accept any file type. */
  accept?: string
  /** Max size per file, in bytes. A file over this is rejected, never added to `value`. */
  maxSize?: number
  multiple?: boolean
  disabled?: boolean
  /** Currently selected files — controlled, like every other form control in this library. */
  value?: File[]
  onFilesChange?: (files: File[]) => void
  /** Called once per rejected file. The component already shows a default inline error message
   *  (`error` below is display-only, not settable) — use this if the app wants to log/report
   *  rejections too, not to render its own message. */
  onFileRejected?: (rejection: FileRejection) => void
}

function matchesAccept(file: File, accept?: string): boolean {
  if (!accept) return true
  const patterns = accept
    .split(',')
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean)
  if (patterns.length === 0) return true
  const name = file.name.toLowerCase()
  const type = file.type.toLowerCase()
  return patterns.some((pattern) => {
    if (pattern.startsWith('.')) return name.endsWith(pattern)
    if (pattern.endsWith('/*')) return type.startsWith(pattern.slice(0, -1))
    return type === pattern
  })
}

function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** i
  return `${i === 0 ? value : value.toFixed(1)} ${units[i]}`
}

function rejectionMessage(rejections: FileRejection[]): string {
  if (rejections.length === 1) {
    const [r] = rejections
    return r.reason === 'size'
      ? `"${r.file.name}" exceeds the maximum file size`
      : `"${r.file.name}" is not an accepted file type`
  }
  return `${rejections.length} files were rejected (wrong type or too large)`
}

export const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      className,
      label,
      helperText,
      accept,
      maxSize,
      multiple = false,
      disabled = false,
      value,
      onFilesChange,
      onFileRejected,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [dragging, setDragging] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const descId = React.useId()

    const handleFiles = (fileList: FileList | File[]) => {
      const files = Array.from(fileList)
      const accepted: File[] = []
      const rejections: FileRejection[] = []
      for (const file of files) {
        if (!matchesAccept(file, accept)) {
          rejections.push({ file, reason: 'type' })
        } else if (maxSize != null && file.size > maxSize) {
          rejections.push({ file, reason: 'size' })
        } else {
          accepted.push(file)
        }
      }
      rejections.forEach((r) => onFileRejected?.(r))
      setError(rejections.length > 0 ? rejectionMessage(rejections) : null)
      if (accepted.length === 0) return
      const next = multiple ? [...(value ?? []), ...accepted] : accepted.slice(0, 1)
      onFilesChange?.(next)
    }

    const openPicker = () => {
      if (!disabled) inputRef.current?.click()
    }

    return (
      <div className="flex flex-col gap-1">
        {label && <label className="text-sm font-medium text-foreground">{label}</label>}
        <div
          ref={ref}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          aria-describedby={error || helperText ? descId : undefined}
          onClick={openPicker}
          onKeyDown={(e) => {
            if (disabled) return
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              openPicker()
            }
          }}
          onDragOver={(e) => {
            e.preventDefault()
            if (!disabled) setDragging(true)
          }}
          onDragLeave={(e) => {
            e.preventDefault()
            setDragging(false)
          }}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            if (disabled) return
            handleFiles(e.dataTransfer.files)
          }}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-input bg-background px-md py-lg text-center transition-colors',
            'hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            dragging && 'border-primary bg-accent',
            disabled && 'cursor-not-allowed opacity-50',
            error && 'border-destructive',
            className
          )}
          {...props}
        >
          <input
            ref={inputRef}
            type="file"
            tabIndex={-1}
            aria-hidden="true"
            className="sr-only"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            onChange={(e) => {
              if (e.currentTarget.files) handleFiles(e.currentTarget.files)
              e.currentTarget.value = ''
            }}
          />
          <span className="text-sm text-foreground">
            {dragging ? 'Drop files here' : 'Click or drag files here to upload'}
          </span>
          {(accept || maxSize != null) && (
            <span className="text-xs text-muted-foreground">
              {[accept, maxSize != null ? `up to ${formatBytes(maxSize)}` : null]
                .filter(Boolean)
                .join(' · ')}
            </span>
          )}
        </div>
        {error && (
          <p id={descId} role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={descId} className="text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
        {value && value.length > 0 && (
          <ul className="mt-1 flex flex-col gap-1">
            {value.map((file, i) => (
              <li
                key={`${file.name}-${i}`}
                className="flex items-center justify-between gap-2 rounded-md border border-input bg-background px-sm py-1 text-sm"
              >
                <span className="truncate">{file.name}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatBytes(file.size)}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onFilesChange?.(value.filter((_, idx) => idx !== i))
                  }}
                  className="inline-flex shrink-0 items-center justify-center rounded-full p-0.5 opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  aria-label={`Remove ${file.name}`}
                >
                  <svg
                    className="h-3 w-3"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M2 2l8 8M10 2l-8 8" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }
)
FileUpload.displayName = 'FileUpload'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cn } from '../../lib/utils'

export type CommandPaletteItem = {
  id: string
  label: string
}

export interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: CommandPaletteItem[]
  onSelect: (id: string) => void
  placeholder?: string
  emptyMessage?: string
}

/**
 * Generic overlay + search input + filtered, keyboard-navigable list — the "cmdk"-style shape a
 * command palette needs (`ArrowUp`/`ArrowDown` to move, `Enter` to select, `Escape` to close via
 * Radix's own Dialog behavior). Deliberately knows nothing about what an "item" *means* — a page
 * to navigate to, an entity to search, a document — that's the caller's job
 * (`@metap/platform-ui` registers real navigation actions on top of this). Filtering is a plain
 * case-insensitive substring match on `label`, no fuzzy-match library — same simplicity level as
 * this design system's other list/select primitives (`Select`/`Autocomplete`).
 */
export function CommandPalette({
  open,
  onOpenChange,
  items,
  onSelect,
  placeholder = 'Type a command…',
  emptyMessage = 'No results.',
}: CommandPaletteProps) {
  const [query, setQuery] = React.useState('')
  const [highlighted, setHighlighted] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const filtered = React.useMemo(
    () => items.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())),
    [items, query]
  )

  // Reset transient state during render (React's documented "adjusting state when a prop
  // changes" pattern: https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-
  // when-a-prop-changes) rather than in a `useEffect` — avoids the extra render pass a
  // `setState`-in-effect would cause and the matching lint rule
  // (`react-hooks/set-state-in-effect`). Query resets when the palette (re)opens; the highlight
  // resets whenever the query itself changes, which already covers the open-reset case too
  // (`query` also changes then, to `''`).
  const [prevOpen, setPrevOpen] = React.useState(open)
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) {
      setQuery('')
    }
  }
  const [prevQuery, setPrevQuery] = React.useState(query)
  if (query !== prevQuery) {
    setPrevQuery(query)
    setHighlighted(0)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlighted((prev) => Math.min(prev + 1, filtered.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlighted((prev) => Math.max(prev - 1, 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const item = filtered[highlighted]
      if (item) {
        onSelect(item.id)
        onOpenChange(false)
      }
    }
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-foreground/50 transition-opacity duration-200 data-[state=closed]:opacity-0 data-[state=open]:opacity-100" />
        <DialogPrimitive.Content
          className="fixed left-1/2 top-24 z-50 w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-lg border border-border bg-background shadow-lg transition-[opacity,transform] duration-200 data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=open]:scale-100 data-[state=open]:opacity-100"
          onOpenAutoFocus={(event) => {
            event.preventDefault()
            inputRef.current?.focus()
          }}
        >
          <DialogPrimitive.Title className="sr-only">Command palette</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            {placeholder}
          </DialogPrimitive.Description>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full border-b border-border bg-transparent px-md py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <ul role="listbox" className="max-h-80 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <li className="px-sm py-4 text-center text-sm text-muted-foreground">{emptyMessage}</li>
            ) : (
              filtered.map((item, index) => (
                <li
                  key={item.id}
                  role="option"
                  aria-selected={index === highlighted}
                  onMouseEnter={() => setHighlighted(index)}
                  onClick={() => {
                    onSelect(item.id)
                    onOpenChange(false)
                  }}
                  className={cn(
                    'cursor-pointer rounded-sm px-sm py-2 text-sm',
                    index === highlighted ? 'bg-accent text-accent-foreground' : 'text-foreground'
                  )}
                >
                  {item.label}
                </li>
              ))
            )}
          </ul>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

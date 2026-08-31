import * as React from 'react'
import { cn } from '../../lib/utils'

// Not a full Tree/expand-collapse widget — just the recursive "indent + left border per nesting
// level" visual shell, extracted from `platform-ui`'s `admin/policies/ConditionNodeEditor.tsx`
// (its doc comment called this out as a confirmed gap: no Tree/nesting primitive existed in
// `@metap/ui`, so the ABAC condition-group tree hand-rolled it with `ml-2`/`border-l-2 pl-4` plus
// an inline `style={{ marginLeft: depth > 0 ? undefined : 0 }}` override to zero the indent only
// at the root). `TreeItem` replaces that hack with a straightforward `depth === 0` branch — depth
// 0 renders no border/indent at all (root level), every deeper level gets the same
// border-l-2 + pl-4 + ml-2 treatment. The consumer still owns the recursion itself (its own
// domain data, its own children) — this is only the per-level shell.
export interface TreeItemProps extends React.HTMLAttributes<HTMLDivElement> {
  depth: number
}

export const TreeItem = React.forwardRef<HTMLDivElement, TreeItemProps>(
  ({ depth, className, ...props }, ref) => (
    <div
      ref={ref}
      data-depth={depth}
      className={cn('flex flex-col gap-2', depth > 0 && 'ml-2 border-l-2 border-border pl-4', className)}
      {...props}
    />
  )
)
TreeItem.displayName = 'TreeItem'

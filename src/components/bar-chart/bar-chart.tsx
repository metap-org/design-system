import * as React from 'react'
import { cn } from '../../lib/utils'

/**
 * A small, dependency-free bar chart — count/magnitude by category, the shape a dashboard's
 * "issues by status" / "records by X" widget needs. Generic on purpose: nothing here knows about
 * `jira.issues` or any other entity, it only takes `{label, value, color?}` rows — any consuming
 * app's dashboard/list-summary widget can reuse it the same way other `@metap/ui` components
 * already do for CRUD screens.
 *
 * Renders as inline SVG (no chart library dependency) and reads color/ink from this library's own
 * design tokens (`hsl(var(--...)))`, the same CSS-variable convention every other component here
 * uses) so it inherits the host app's theme (including dark mode) for free rather than shipping a
 * second, disconnected palette. A single un-colored series draws every bar in one hue
 * (`--primary`) — per-bar `color` is for when category identity itself carries meaning beyond the
 * axis label (e.g. priority's red/orange/yellow/gray), not decoration.
 *
 * Moved here from `../platform-ui/src/charts/BarChart.tsx` (2026-09-01) — a pure UI atom with no
 * business coupling had ended up in `platform-ui` instead of `@metap/ui`, the same architecture
 * gap `docs/component-status.md`'s `TagsInput`/`SuggestInput`/`MultiSelect`/`TreeItem` rows
 * already document being caught and fixed for. Only change versus the original: accepts
 * `className` (merged via `cn()`, matching every other component's convention) instead of a fixed
 * inline `style` object.
 */

export type BarChartDatum = {
  label: string
  value: number
  /** A CSS color (e.g. `hsl(var(--destructive))`) — omit to use the default single sequential
   *  hue for every bar. */
  color?: string
}

export interface BarChartProps extends React.SVGAttributes<SVGSVGElement> {
  data: BarChartDatum[]
  height?: number
  ariaLabel?: string
}

export const BarChart = React.forwardRef<SVGSVGElement, BarChartProps>(
  ({ data, height = 200, ariaLabel, className, ...props }, ref) => {
    const padding = { top: 22, right: 8, bottom: 28, left: 8 }
    const barWidth = 44
    const gap = 20
    const innerW = Math.max(data.length * barWidth + Math.max(data.length - 1, 0) * gap, barWidth)
    const width = innerW + padding.left + padding.right
    const innerH = height - padding.top - padding.bottom
    const maxValue = Math.max(...data.map((d) => d.value), 1)
    const baselineY = height - padding.bottom

    return (
      <svg
        ref={ref}
        width="100%"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={ariaLabel ?? 'Bar chart'}
        className={cn('block max-w-full', className)}
        {...props}
      >
        <line
          x1={padding.left}
          y1={baselineY}
          x2={width - padding.right}
          y2={baselineY}
          stroke="hsl(var(--border))"
        />
        {data.map((d, i) => {
          const x = padding.left + i * (barWidth + gap)
          const barHeight =
            maxValue > 0 ? Math.max((d.value / maxValue) * innerH, d.value > 0 ? 2 : 0) : 0
          const y = baselineY - barHeight
          const color = d.color ?? 'hsl(var(--primary))'
          return (
            <g key={d.label}>
              <title>{`${d.label}: ${d.value}`}</title>
              <rect x={x} y={y} width={barWidth} height={barHeight} rx={4} fill={color} />
              <text
                x={x + barWidth / 2}
                y={y - 6}
                textAnchor="middle"
                fontSize={12}
                fill="hsl(var(--muted-foreground))"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {d.value}
              </text>
              <text
                x={x + barWidth / 2}
                y={baselineY + 16}
                textAnchor="middle"
                fontSize={11}
                fill="hsl(var(--muted-foreground))"
              >
                {d.label}
              </text>
            </g>
          )
        })}
      </svg>
    )
  }
)
BarChart.displayName = 'BarChart'

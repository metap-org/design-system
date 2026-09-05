import * as React from 'react'
import { cn } from '../../lib/utils'

/**
 * Time-series line/area chart over `{label, value}` rows. Inline SVG, no chart library — the same
 * call `BarChart` made, and for the same reason: one series of counts over time does not justify a
 * dependency, and reading colour from the design tokens (`hsl(var(--...)))`) means it themes with
 * everything else for free.
 *
 * Moved here from `metap-demo-waf/data-plane/web` (2026-09-05,
 * `docs/features/26-waf-primitives-to-design-system.md`) — its own doc-comment already called out
 * "the same call `@metap/ui`'s own `BarChart` made", confirmed on read. `ariaLabel`/`emptyMessage`
 * are plain-string props with English defaults (like `BarChart.ariaLabel`), not i18n-aware —
 * unlike the original, which hardcoded 2 WAF-specific `react-i18next` keys; a caller passes its
 * own translated string, same as `BarChart` callers already do for `ariaLabel`.
 */
export type TimeSeriesPoint = {
  label: string
  value: number
}

export interface TimeSeriesProps extends Omit<React.SVGAttributes<SVGSVGElement>, 'points'> {
  points: TimeSeriesPoint[]
  height?: number
  ariaLabel?: string
  emptyMessage?: string
}

export function TimeSeries({
  points,
  height = 180,
  ariaLabel = 'Time series',
  emptyMessage = 'No data in this window',
  className,
  ...props
}: TimeSeriesProps) {
  if (points.length === 0) {
    return <div className="py-10 text-center text-sm text-muted-foreground">{emptyMessage}</div>
  }
  const width = 640
  const padding = { top: 12, right: 12, bottom: 22, left: 34 }
  const innerW = width - padding.left - padding.right
  const innerH = height - padding.top - padding.bottom
  const max = Math.max(...points.map((p) => p.value), 1)
  // A single point has no span to divide by — pin it to the left edge instead of dividing by zero.
  const stepX = points.length > 1 ? innerW / (points.length - 1) : 0
  const coords = points.map((point, index) => {
    const x = padding.left + index * stepX
    const y = padding.top + innerH - (point.value / max) * innerH
    return { x, y, ...point }
  })
  const line = coords
    .map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)},${c.y.toFixed(1)}`)
    .join(' ')
  const area = `${line} L${(padding.left + (points.length - 1) * stepX).toFixed(1)},${padding.top + innerH} L${padding.left},${padding.top + innerH} Z`

  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      viewBox={`0 0 ${width} ${height}`}
      className={cn('w-full', className)}
      preserveAspectRatio="none"
      {...props}
    >
      <line
        x1={padding.left}
        y1={padding.top + innerH}
        x2={width - padding.right}
        y2={padding.top + innerH}
        stroke="hsl(var(--border))"
      />
      <text x={4} y={padding.top + 8} className="text-[10px]" fill="hsl(var(--muted-foreground))">
        {max}
      </text>
      <path d={area} fill="hsl(var(--primary))" opacity={0.12} />
      <path d={line} fill="none" stroke="hsl(var(--primary))" strokeWidth={2} />
      {coords.map((c) => (
        <circle key={c.label} cx={c.x} cy={c.y} r={2.5} fill="hsl(var(--primary))">
          <title>{`${c.label}: ${c.value}`}</title>
        </circle>
      ))}
      {/* Only the ends are labelled — a dense axis on a 640-wide viewBox that scales down to a
          phone becomes unreadable overlap, and the per-point tooltip already carries the detail. */}
      <text x={padding.left} y={height - 6} className="text-[10px]" fill="hsl(var(--muted-foreground))">
        {points[0]?.label}
      </text>
      <text
        x={width - padding.right}
        y={height - 6}
        textAnchor="end"
        className="text-[10px]"
        fill="hsl(var(--muted-foreground))"
      >
        {points[points.length - 1]?.label}
      </text>
    </svg>
  )
}

import * as React from 'react'
import qrcode from 'qrcode-generator'
import { cn } from '../../lib/utils'

/**
 * A QR code for a short string (an `otpauth://` enrolment link, a URL), drawn as one SVG path.
 * Always dark modules on a white quiet zone, whatever the theme: phone scanners read
 * dark-on-light, and an inverted code fails on many of them.
 */
export interface QrCodeProps extends Omit<React.SVGAttributes<SVGSVGElement>, 'children'> {
  value: string
  /** Rendered width and height in pixels. */
  size?: number
  /** Error correction; M (15%) suits a code shown on a screen. */
  level?: 'L' | 'M' | 'Q' | 'H'
  /** Accessible name; the encoded value is not read out. */
  label?: string
}

const QUIET_ZONE = 4

export function qrPath(value: string, level: QrCodeProps['level'] = 'M') {
  const qr = qrcode(0, level)
  qr.addData(value, 'Byte')
  qr.make()
  const count = qr.getModuleCount()
  let d = ''
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (qr.isDark(row, col)) d += `M${col + QUIET_ZONE} ${row + QUIET_ZONE}h1v1h-1z`
    }
  }
  return { d, extent: count + QUIET_ZONE * 2 }
}

export const QrCode = React.forwardRef<SVGSVGElement, QrCodeProps>(
  ({ value, size = 192, level = 'M', label = 'QR code', className, ...props }, ref) => {
    const { d, extent } = React.useMemo(() => qrPath(value, level), [value, level])
    return (
      <svg
        ref={ref}
        role="img"
        aria-label={label}
        width={size}
        height={size}
        viewBox={`0 0 ${extent} ${extent}`}
        shapeRendering="crispEdges"
        className={cn('rounded-md', className)}
        {...props}
      >
        <rect width={extent} height={extent} fill="#ffffff" />
        <path d={d} fill="#000000" />
      </svg>
    )
  },
)
QrCode.displayName = 'QrCode'

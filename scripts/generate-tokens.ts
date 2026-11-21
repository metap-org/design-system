import { writeFileSync } from 'fs'
import { resolve } from 'path'
import { tokens } from '../src/tokens/tokens'

function extractHsl(value: string): string {
  const match = value.match(/hsl\(([^)]+)\)/)
  return match ? match[1] : value
}

const lightVars: Record<string, string> = {
  '--background': extractHsl(tokens.colors.background),
  '--foreground': extractHsl(tokens.colors.foreground),
  '--primary': extractHsl(tokens.colors.primary.DEFAULT),
  '--primary-foreground': extractHsl(tokens.colors.primary.foreground),
  '--secondary': extractHsl(tokens.colors.secondary.DEFAULT),
  '--secondary-foreground': extractHsl(tokens.colors.secondary.foreground),
  '--destructive': extractHsl(tokens.colors.destructive.DEFAULT),
  '--destructive-foreground': extractHsl(tokens.colors.destructive.foreground),
  '--muted': extractHsl(tokens.colors.muted.DEFAULT),
  '--muted-foreground': extractHsl(tokens.colors.muted.foreground),
  '--accent': extractHsl(tokens.colors.accent.DEFAULT),
  '--accent-foreground': extractHsl(tokens.colors.accent.foreground),
  '--popover': extractHsl(tokens.colors.popover.DEFAULT),
  '--popover-foreground': extractHsl(tokens.colors.popover.foreground),
  '--card': extractHsl(tokens.colors.card.DEFAULT),
  '--card-foreground': extractHsl(tokens.colors.card.foreground),
  '--border': extractHsl(tokens.colors.border),
  '--input': extractHsl(tokens.colors.input),
  '--ring': extractHsl(tokens.colors.ring),
  '--radius': tokens.radius.md,
  '--success': extractHsl(tokens.colors.success.DEFAULT),
  '--success-foreground': extractHsl(tokens.colors.success.foreground),
  '--warning': extractHsl(tokens.colors.warning.DEFAULT),
  '--warning-foreground': extractHsl(tokens.colors.warning.foreground),
  '--info': extractHsl(tokens.colors.info.DEFAULT),
  '--info-foreground': extractHsl(tokens.colors.info.foreground),
  '--sidebar': extractHsl(tokens.colors.sidebar.DEFAULT),
  '--sidebar-foreground': extractHsl(tokens.colors.sidebar.foreground),
  '--sidebar-accent': extractHsl(tokens.colors.sidebar.accent),
  '--sidebar-accent-foreground': extractHsl(tokens.colors.sidebar.accentForeground),
  '--sidebar-primary': extractHsl(tokens.colors.sidebar.primary),
  '--sidebar-border': extractHsl(tokens.colors.sidebar.border),
  '--chart-1': extractHsl(tokens.colors.chart[1]),
  '--chart-2': extractHsl(tokens.colors.chart[2]),
  '--chart-3': extractHsl(tokens.colors.chart[3]),
  '--chart-4': extractHsl(tokens.colors.chart[4]),
  '--chart-5': extractHsl(tokens.colors.chart[5]),
  '--font-sans': tokens.typography.fontFamily.sans,
  '--font-mono': tokens.typography.fontFamily.mono,
  '--shadow-color': '222 47% 11%',
}

const darkVars: Record<string, string> = {
  '--background': '222.2 84% 4.9%',
  '--foreground': '210 40% 98%',
  '--primary': '210 40% 98%',
  '--primary-foreground': '222.2 47.4% 11.2%',
  '--secondary': '217.2 32.6% 17.5%',
  '--secondary-foreground': '210 40% 98%',
  '--destructive': '0 62.8% 30.6%',
  '--destructive-foreground': '210 40% 98%',
  '--muted': '217.2 32.6% 17.5%',
  '--muted-foreground': '215 20.2% 65.1%',
  '--accent': '217.2 32.6% 17.5%',
  '--accent-foreground': '210 40% 98%',
  '--popover': '222.2 84% 4.9%',
  '--popover-foreground': '210 40% 98%',
  '--card': '222.2 84% 4.9%',
  '--card-foreground': '210 40% 98%',
  '--border': '217.2 32.6% 17.5%',
  '--input': '217.2 32.6% 17.5%',
  '--ring': '212.7 26.8% 83.9%',
  '--radius': tokens.radius.md,
  '--success': '160 84% 39%',
  '--success-foreground': '160 84% 5%',
  '--warning': '38 92% 50%',
  '--warning-foreground': '222.2 84% 4.9%',
  '--info': '213 94% 68%',
  '--info-foreground': '222.2 84% 4.9%',
  '--sidebar': '222.2 84% 6.5%',
  '--sidebar-foreground': '215 20.2% 65.1%',
  '--sidebar-accent': '217.2 32.6% 17.5%',
  '--sidebar-accent-foreground': '210 40% 98%',
  '--sidebar-primary': '210 40% 98%',
  '--sidebar-border': '217.2 32.6% 17.5%',
  '--chart-1': '210 40% 98%',
  '--chart-2': '213 94% 68%',
  '--chart-3': '160 84% 39%',
  '--chart-4': '38 92% 50%',
  '--chart-5': '262 83% 70%',
  '--font-sans': tokens.typography.fontFamily.sans,
  '--font-mono': tokens.typography.fontFamily.mono,
  '--shadow-color': '0 0% 0%',
}

function varsToCSS(vars: Record<string, string>, indent: string): string {
  return Object.entries(vars)
    .map(([k, v]) => `${indent}${k}: ${v};`)
    .join('\n')
}

const css = `@tailwind base;
@tailwind components;
@tailwind utilities;

/* AUTO-GENERATED — run \`pnpm tokens:generate\` to update */
@layer base {
  html {
    font-family: var(--font-sans);
  }

  /* Motion is decoration here: a person who asked their system for less of it gets none. */
  @media (prefers-reduced-motion: reduce) {
    *,
    ::before,
    ::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  :root {
${varsToCSS(lightVars, '    ')}
  }

  .dark {
${varsToCSS(darkVars, '    ')}
  }
}
`

const outputPath = resolve(process.cwd(), 'src/styles/globals.css')
writeFileSync(outputPath, css, 'utf-8')
console.log('✓ Generated src/styles/globals.css')

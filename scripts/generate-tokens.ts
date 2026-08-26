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

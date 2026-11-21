import { tokens } from './tokens/tokens'

const preset = {
  darkMode: 'class' as const,
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar))',
          foreground: 'hsl(var(--sidebar-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          border: 'hsl(var(--sidebar-border))',
        },
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      boxShadow: {
        xs: '0 1px 1px 0 hsl(var(--shadow-color) / 0.05)',
        sm: '0 1px 2px 0 hsl(var(--shadow-color) / 0.06), 0 1px 3px 0 hsl(var(--shadow-color) / 0.08)',
        md: '0 2px 4px -1px hsl(var(--shadow-color) / 0.06), 0 6px 12px -2px hsl(var(--shadow-color) / 0.10)',
        lg: '0 4px 6px -2px hsl(var(--shadow-color) / 0.05), 0 16px 32px -8px hsl(var(--shadow-color) / 0.18)',
      },
      // Overlays enter with a keyframe animation rather than a CSS transition: a transition only
      // runs between two states of an element that already exists, and a popover or dialog is
      // mounted already open, so it used to appear with no motion at all. The independent
      // `scale`/`translate` properties compose with the centering transforms some of them use.
      keyframes: {
        'pop-in': {
          from: { opacity: '0', scale: '0.96', translate: '0 -2px' },
          to: { opacity: '1', scale: '1', translate: '0 0' },
        },
        'pop-out': {
          from: { opacity: '1', scale: '1', translate: '0 0' },
          to: { opacity: '0', scale: '0.96', translate: '0 -2px' },
        },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        shimmer: { to: { transform: 'translateX(100%)' } },
        'toast-in': {
          from: { opacity: '0', translate: '0 8px', scale: '0.98' },
          to: { opacity: '1', translate: '0 0', scale: '1' },
        },
        'fade-out': { from: { opacity: '1' }, to: { opacity: '0' } },
        'dialog-in': {
          from: { opacity: '0', scale: '0.96' },
          to: { opacity: '1', scale: '1' },
        },
        'dialog-out': {
          from: { opacity: '1', scale: '1' },
          to: { opacity: '0', scale: '0.96' },
        },
        'sheet-right-in': { from: { translate: '100% 0' }, to: { translate: '0 0' } },
        'sheet-right-out': { from: { translate: '0 0' }, to: { translate: '100% 0' } },
        'sheet-left-in': { from: { translate: '-100% 0' }, to: { translate: '0 0' } },
        'sheet-left-out': { from: { translate: '0 0' }, to: { translate: '-100% 0' } },
        'sheet-top-in': { from: { translate: '0 -100%' }, to: { translate: '0 0' } },
        'sheet-top-out': { from: { translate: '0 0' }, to: { translate: '0 -100%' } },
        'sheet-bottom-in': { from: { translate: '0 100%' }, to: { translate: '0 0' } },
        'sheet-bottom-out': { from: { translate: '0 0' }, to: { translate: '0 100%' } },
      },
      animation: {
        'pop-in': 'pop-in 160ms cubic-bezier(0.16, 1, 0.3, 1)',
        'pop-out': 'pop-out 110ms ease-in forwards',
        'fade-in': 'fade-in 160ms ease-out',
        shimmer: 'shimmer 1.6s ease-in-out infinite',
        'toast-in': 'toast-in 220ms cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-out': 'fade-out 120ms ease-in forwards',
        'dialog-in': 'dialog-in 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        'dialog-out': 'dialog-out 140ms ease-in forwards',
        'sheet-right-in': 'sheet-right-in 260ms cubic-bezier(0.16, 1, 0.3, 1)',
        'sheet-right-out': 'sheet-right-out 180ms ease-in forwards',
        'sheet-left-in': 'sheet-left-in 260ms cubic-bezier(0.16, 1, 0.3, 1)',
        'sheet-left-out': 'sheet-left-out 180ms ease-in forwards',
        'sheet-top-in': 'sheet-top-in 260ms cubic-bezier(0.16, 1, 0.3, 1)',
        'sheet-top-out': 'sheet-top-out 180ms ease-in forwards',
        'sheet-bottom-in': 'sheet-bottom-in 260ms cubic-bezier(0.16, 1, 0.3, 1)',
        'sheet-bottom-out': 'sheet-bottom-out 180ms ease-in forwards',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },

      borderRadius: {
        sm: 'calc(var(--radius) - 4px)',
        md: 'calc(var(--radius) - 2px)',
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 4px)',
        full: tokens.radius.full,
      },
      spacing: tokens.spacing as Record<string, string>,
      fontSize: tokens.typography.fontSize as Record<string, string>,
    },
  },
}

export default preset

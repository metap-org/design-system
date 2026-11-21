export const tokens = {
  colors: {
    primary: {
      DEFAULT: 'hsl(222.2 47.4% 11.2%)',
      foreground: 'hsl(210 40% 98%)',
    },
    secondary: {
      DEFAULT: 'hsl(210 40% 96.1%)',
      foreground: 'hsl(222.2 47.4% 11.2%)',
    },
    destructive: {
      DEFAULT: 'hsl(0 84.2% 60.2%)',
      foreground: 'hsl(210 40% 98%)',
    },
    border: 'hsl(214.3 31.8% 91.4%)',
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(222.2 84% 4.9%)',
    muted: {
      DEFAULT: 'hsl(210 40% 96.1%)',
      foreground: 'hsl(215.4 16.3% 46.9%)',
    },
    accent: {
      DEFAULT: 'hsl(210 40% 96.1%)',
      foreground: 'hsl(222.2 47.4% 11.2%)',
    },
    popover: {
      DEFAULT: 'hsl(0 0% 100%)',
      foreground: 'hsl(222.2 84% 4.9%)',
    },
    card: {
      DEFAULT: 'hsl(0 0% 100%)',
      foreground: 'hsl(222.2 84% 4.9%)',
    },
    input: 'hsl(214.3 31.8% 91.4%)',
    ring: 'hsl(222.2 84% 4.9%)',
    // Status colors a product needs beyond primary/destructive (allowed vs. blocked, healthy vs.
    // degraded, informational). Defaults match the emerald/amber/blue the components hard-coded
    // before these tokens existed, so a theme that sets none of them looks the same as it did.
    success: {
      DEFAULT: 'hsl(161 94% 30%)',
      foreground: 'hsl(0 0% 100%)',
    },
    warning: {
      DEFAULT: 'hsl(38 92% 50%)',
      foreground: 'hsl(222.2 84% 4.9%)',
    },
    info: {
      DEFAULT: 'hsl(217 91% 50%)',
      foreground: 'hsl(0 0% 100%)',
    },
    // App navigation rail. Separate from background/muted so a theme can make it a dark rail next
    // to a light page (the control-room look) without recoloring cards, inputs or popovers.
    sidebar: {
      DEFAULT: 'hsl(210 40% 98.8%)',
      foreground: 'hsl(215.4 16.3% 46.9%)',
      accent: 'hsl(210 40% 96.1%)',
      accentForeground: 'hsl(222.2 47.4% 11.2%)',
      primary: 'hsl(222.2 47.4% 11.2%)',
      border: 'hsl(214.3 31.8% 91.4%)',
    },
    // Categorical series for charts: one hue per series, in order. Unrelated to status colors, so
    // a chart of "blocked vs. allowed" can still choose success/destructive explicitly.
    chart: {
      1: 'hsl(222.2 47.4% 11.2%)',
      2: 'hsl(217 91% 50%)',
      3: 'hsl(161 94% 30%)',
      4: 'hsl(38 92% 50%)',
      5: 'hsl(262 83% 58%)',
    },
  },
  radius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  typography: {
    fontFamily: {
      sans: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
    },
    fontSize: {
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
    },
  },
} as const

import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Default tailwind-merge only recognizes Tailwind's built-in numeric spacing scale (0, 1, 2,
// ..., px, full, auto) as valid values for spacing-based utilities (p-*/px-*/py-*/m-*/gap-*/
// w-*/h-*/...). `tokens.spacing` (`src/tokens/tokens.ts`) replaces that scale entirely with
// named tokens (xs/sm/md/lg/xl) — without this extension, twMerge treats `px-md`/`py-sm`/etc.
// as unrecognized classes it can't group, so a later conflicting class (e.g. `p-0` meant to
// override them) is appended instead of replacing them, and both end up in the DOM. Found live
// building `IconButton` (2026-08-28): `p-0` failed to cancel `buttonVariants`'s `px-md py-sm`.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

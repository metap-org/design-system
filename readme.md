# React UI Library — Implementation Guide

> File này dùng làm ngữ cảnh khởi động cho Claude Code. Thực hiện tuần tự từng phase, mỗi phase xong thì commit trước khi sang phase tiếp theo.

## Mục tiêu

Xây dựng một component library React (`@your-org/ui-lib`) độc lập, dùng **Tailwind CSS + shadcn/ui**, build sẵn CSS, publish qua private npm registry (Verdaccio self-host hoặc GitHub Packages), để cài vào các project gốc (grocery-app, F&B app, DocFlow, ...) qua `npm install`.

## Stack

- React 18+, TypeScript
- Tailwind CSS + shadcn/ui (Radix UI primitives)
- `class-variance-authority` (CVA) cho variant styling
- `clsx` + `tailwind-merge` cho class merging
- `tsup` để build (ESM + CJS + `.d.ts`)
- Storybook cho dev/preview isolated
- Vitest + React Testing Library cho test
- Changesets cho versioning/changelog

---

## Phase 1 — Khởi tạo project

1. Tạo repo mới (`ui-lib`), init với pnpm (khuyến nghị hơn npm/yarn vì nhanh và tiết kiệm dung lượng cho monorepo-style tooling dù đây là single package).
2. Cài TypeScript, React, React-DOM (devDependencies/peerDependencies).
3. Setup ESLint + Prettier theo convention chuẩn React/TS.
4. Cấu trúc thư mục:

```
ui-lib/
├── src/
│   ├── components/
│   │   ├── button/
│   │   │   ├── button.tsx
│   │   │   ├── button.stories.tsx
│   │   │   ├── button.test.tsx
│   │   │   └── index.ts
│   │   └── ...
│   ├── lib/
│   │   └── utils.ts          # cn() = twMerge(clsx(...))
│   ├── styles/
│   │   └── globals.css       # @tailwind base/components/utilities + CSS vars
│   └── index.ts              # barrel export
├── .storybook/
├── tailwind.config.ts        # export như preset
├── tsup.config.ts
├── vitest.config.ts
├── components.json           # config CLI của shadcn
├── package.json
└── README.md
```

**Việc cần làm:**
- [ ] Khởi tạo repo, `pnpm init`
- [ ] Cài `react`, `react-dom` là `peerDependencies`
- [ ] Cài TypeScript, `tsconfig.json` (target ES2020, module ESNext, strict true, jsx react-jsx)
- [ ] Setup ESLint + Prettier

---

## Phase 2 — Tailwind + shadcn/ui setup

1. Cài Tailwind, PostCSS, Autoprefixer.
2. Khởi tạo `components.json` (config chuẩn của shadcn CLI) để dùng `npx shadcn add <component>` sinh code trực tiếp vào `src/components/`.
3. Định nghĩa CSS variables theme (light/dark) trong `src/styles/globals.css` theo convention của shadcn (`--background`, `--primary`, `--radius`, ...).
4. `tailwind.config.ts` phải:
   - Định nghĩa `darkMode: 'class'`
   - Map màu theo CSS variables (`colors: { primary: 'hsl(var(--primary))', ... }`)
   - Export ra được dùng lại như 1 **preset** cho project gốc (xem Phase 5)

**Việc cần làm:**
- [ ] `pnpm add -D tailwindcss postcss autoprefixer`
- [ ] `npx shadcn init` → chọn style, base color, CSS variables
- [ ] Viết `src/lib/utils.ts`:
  ```ts
  import { clsx, type ClassValue } from 'clsx'
  import { twMerge } from 'tailwind-merge'

  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
  }
  ```
- [ ] Cài thêm khi cần theo từng component: `@radix-ui/react-*`, `class-variance-authority`, `lucide-react`

---

## Phase 2.5 — Design Tokens (nguồn chân lý duy nhất)

**Nguyên tắc bắt buộc: mọi component KHÔNG được hardcode giá trị màu/spacing/radius/font trực tiếp.** Tất cả phải tham chiếu về 1 file tokens trung tâm. Khi cần đổi theme (màu chủ đạo, bo góc, khoảng cách chuẩn...), chỉ sửa file này — toàn bộ component tự động ăn theo, không phải sửa từng component.

### Cấu trúc

```
src/
├── tokens/
│   ├── tokens.ts          # nguồn chân lý: object định nghĩa toàn bộ token
│   ├── colors.css         # generate ra CSS variables (light/dark) từ tokens.ts
│   └── index.ts
├── components/
│   └── button/
│       └── button.tsx      # KHÔNG hardcode màu/spacing — chỉ dùng token qua Tailwind class semantic
```

### `src/tokens/tokens.ts` — định nghĩa mọi giá trị thiết kế tại đây

```ts
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
  },
  radius: {
    sm: '0.25rem',
    md: '0.5rem',   // dùng làm mặc định cho button, card, input
    lg: '0.75rem',
    full: '9999px',
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',     // padding mặc định button size=default
    lg: '1.5rem',
    xl: '2rem',
  },
  typography: {
    fontSize: {
      sm: '0.875rem',
      base: '1rem',   // mặc định cho button, input
      lg: '1.125rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
    },
  },
} as const
```

### Generate CSS variables từ tokens (light/dark)

Viết 1 script nhỏ (`scripts/generate-tokens.ts`, chạy bằng `tsx`) đọc `tokens.ts` và xuất ra `src/styles/globals.css` dạng CSS variables — đây là cầu nối để Tailwind và shadcn component đọc được:

```css
/* src/styles/globals.css — phần được generate, không sửa tay */
:root {
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --radius: 0.5rem;
  /* ... generate từ tokens.ts */
}
.dark {
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  /* ... */
}
```

Thêm script vào `package.json`:
```json
"scripts": {
  "tokens:generate": "tsx scripts/generate-tokens.ts",
  "build": "pnpm tokens:generate && tsup && pnpm build:css"
}
```

→ Nhờ chạy generate trước mỗi lần build, sửa `tokens.ts` là đủ — không cần đụng vào `globals.css` hay từng component.

### `tailwind.config.ts` đọc token qua CSS variables (không hardcode số)

```ts
import type { Config } from 'tailwindcss'
import { tokens } from './src/tokens/tokens'

export default {
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
      },
      borderRadius: {
        sm: 'calc(var(--radius) - 4px)',
        md: 'calc(var(--radius) - 2px)',
        lg: 'var(--radius)',
      },
      spacing: tokens.spacing,
      fontSize: tokens.typography.fontSize,
    },
  },
} satisfies Config
```

### Quy tắc bắt buộc khi viết component (áp dụng từ Phase 3 trở đi)

- Component **chỉ dùng class semantic** (`bg-primary`, `text-primary-foreground`, `rounded-md`, `p-md`) — **không bao giờ** dùng giá trị arbitrary như `bg-[#1a1a2e]`, `p-[13px]`, `rounded-[6px]`.
- Nếu 1 component cần variant màu mới (ví dụ thêm `variant="success"`), thêm token màu đó vào `tokens.ts` trước, generate lại CSS variables, rồi mới thêm variant vào CVA config của component — không tạo giá trị màu rời rạc ngay trong file component.
- Spacing (padding/margin) của mọi size variant (`sm`, `default`, `lg`) phải map về `tokens.spacing`, không tự ý viết số rem/px mới.

**Việc cần làm:**
- [ ] Viết `src/tokens/tokens.ts` với đầy đủ colors/radius/spacing/typography
- [ ] Viết script `scripts/generate-tokens.ts` xuất CSS variables (light + dark) từ tokens
- [ ] Cập nhật `tailwind.config.ts` để map theme về CSS variables thay vì hardcode
- [ ] Thêm `tokens:generate` vào script `build`, chạy thử để verify `globals.css` sinh đúng

---

## Phase 3 — Component đầu tiên (Button) làm mẫu

Dùng `npx shadcn add button` để sinh code, sau đó chuẩn hoá lại theo cấu trúc thư mục của lib (mỗi component 1 folder riêng, có `index.ts` export).

**Bắt buộc: component chỉ dùng class semantic tham chiếu từ token (xem Phase 2.5), không hardcode giá trị.**

Ví dụ pattern chuẩn dùng CVA:

```tsx
// src/components/button/button.tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-accent',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-md py-sm',   // px-md/py-sm map về tokens.spacing, không phải số cứng
        sm: 'h-9 px-sm',
        lg: 'h-11 px-lg',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
)
Button.displayName = 'Button'
```

Lặp lại pattern này cho các component tiếp theo (Card, Dialog, Input, Select, Table, Badge, Toast, ...) — ưu tiên các component sẽ dùng chung cho grocery-app / F&B app / DocFlow trước (Table, Dialog, Form controls, Toast).

**Việc cần làm:**
- [ ] Build Button theo pattern trên
- [ ] Viết story cho Storybook (`button.stories.tsx`)
- [ ] Viết test cơ bản (render, click handler, variant class)
- [ ] Export trong `src/components/button/index.ts` và `src/index.ts`

---

## Phase 4 — Build pipeline (`tsup`)

```ts
// tsup.config.ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  injectStyle: false, // CSS build riêng, không inline vào JS
})
```

CSS build riêng bằng Tailwind CLI, output ra `dist/style.css` chứa mọi utility classes mà component dùng:

```json
// package.json — script build CSS
"build:css": "tailwindcss -i ./src/styles/globals.css -o ./dist/style.css --minify"
```

`package.json` — khai báo export đúng để consumer resolve cả code, types, CSS:

```json
{
  "name": "@your-org/ui-lib",
  "version": "0.1.0",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./style.css": "./dist/style.css",
    "./tailwind-preset": "./tailwind.config.ts"
  },
  "files": ["dist"],
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18"
  },
  "scripts": {
    "build": "tsup && pnpm build:css",
    "build:css": "tailwindcss -i ./src/styles/globals.css -o ./dist/style.css --minify",
    "dev": "storybook dev -p 6006",
    "test": "vitest",
    "lint": "eslint src"
  }
}
```

**Việc cần làm:**
- [ ] Setup `tsup.config.ts`
- [ ] Setup script build CSS riêng
- [ ] Verify `pnpm build` ra đủ `dist/index.js`, `dist/index.mjs`, `dist/index.d.ts`, `dist/style.css`
- [ ] Test import thử bằng 1 project React demo local (`pnpm link` hoặc `file:` dependency) trước khi publish thật

---

## Phase 5 — Cách project gốc dùng lib

**Cách dùng đơn giản (mặc định — dùng CSS build sẵn):**
```ts
// main.tsx của project gốc
import '@your-org/ui-lib/style.css'
import { Button } from '@your-org/ui-lib'
```

**Cách dùng nâng cao (override theme sâu — dùng Tailwind preset):**
```js
// tailwind.config.js của project gốc
export default {
  presets: [require('@your-org/ui-lib/tailwind-preset')],
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@your-org/ui-lib/dist/**/*.{js,mjs}',
  ],
}
```

---

## Phase 6 — Storybook (dev/preview isolated)

- [ ] `npx storybook init` (chọn framework React + Vite)
- [ ] Cấu hình Tailwind trong `.storybook/preview.ts` (import `globals.css`)
- [ ] Mỗi component mới → viết story kèm theo, đây là nơi test UI trực quan trước khi publish

---

## Phase 7 — Versioning & Publish

**Chọn 1 trong 2 registry** (đã quyết định: repo riêng, publish qua registry):

### Option A — Verdaccio self-host (khớp hạ tầng Docker/Traefik hiện có)
- [ ] Deploy Verdaccio container, gắn domain qua Traefik (`npm.yourdomain.com`)
- [ ] `npm adduser --registry https://npm.yourdomain.com`
- [ ] Thêm `.npmrc` trong `ui-lib`:
  ```
  registry=https://npm.yourdomain.com
  ```
- [ ] `npm publish`

### Option B — GitHub Packages
- [ ] Thêm `.npmrc`:
  ```
  @your-org:registry=https://npm.pkg.github.com
  ```
- [ ] Tạo GitHub Actions workflow tự động publish khi tag version mới

### Changesets (dùng chung cho cả 2 option)
- [ ] `pnpm add -D @changesets/cli && pnpm changeset init`
- [ ] Mỗi PR có thay đổi component → `pnpm changeset` (chọn loại semver: patch/minor/major + mô tả)
- [ ] CI: merge vào `main` → `pnpm changeset version` → `pnpm changeset publish`

---

## Phase 8 — CI/CD (GitHub Actions)

Pipeline tối thiểu:
1. `pnpm install`
2. `pnpm lint`
3. `pnpm test`
4. `pnpm build`
5. (Nếu có changeset pending) → version bump + publish tự động

---

## Chiến lược hybrid: component nào vào lib chung, component nào để lại từng app

`@your-org/ui-lib` **chỉ chứa component ổn định, dùng giống hệt nhau ở mọi app**. Các UI đặc thù riêng của từng app (POS order tab của F&B, form ký duyệt của DocFlow...) **không đưa vào lib** — dùng `npx shadcn add` trực tiếp trong app đó, sửa nhanh không qua vòng publish.

### Danh mục component chuẩn thuộc lib chung

| Nhóm | Component |
|---|---|
| **Buttons & actions** | Button, IconButton, ButtonGroup |
| **Form inputs** | Input, Textarea, Select, Combobox, Checkbox, RadioGroup, Switch, DatePicker, NumberInput |
| **Form wrapper & validation** | Form, FormField, FormLabel, FormMessage (xem chi tiết props validate bên dưới) |
| **Data display** | Card, Table, Badge, Chip, Tag, Avatar, Separator, Skeleton |
| **Overlay** | Dialog, Sheet, Popover, Tooltip, DropdownMenu, AlertDialog |
| **Feedback** | Toast/Sonner, Alert, Progress, Spinner |
| **Navigation** | Tabs, Accordion, Breadcrumb, Pagination |

### Thứ tự build (ưu tiên theo tần suất dùng chung giữa grocery-app, F&B app, DocFlow)

1. Button, IconButton, Input, Label, Textarea
2. Card, Badge, Chip, Tag, Separator, Skeleton
3. Form, FormField (kèm validate — xem spec chi tiết bên dưới)
4. Dialog, Sheet, AlertDialog (dùng cho form thêm/sửa, xác nhận xoá)
5. Table (dùng cho danh sách sản phẩm, đơn hàng, tài liệu)
6. Select, Combobox, DatePicker, Checkbox, RadioGroup, Switch, NumberInput
7. Toast/Sonner, Alert, Progress, Spinner
8. Tabs, Accordion, DropdownMenu, Popover, Tooltip, Avatar, Breadcrumb, Pagination

---

## Spec chi tiết: Form controls + validation props

Form controls trong lib chung phải hỗ trợ validate khai báo qua props, không bắt mỗi app tự viết logic validate riêng. Kết hợp `react-hook-form` (quản lý state/submit) + `zod` (schema validate) + wrapper `FormField` (hiển thị lỗi tự động).

### Nguyên tắc

- Mỗi input component (`Input`, `Textarea`, `Select`, `NumberInput`, ...) nhận **props validate cơ bản ở HTML level** (`required`, `minLength`, `maxLength`, `min`, `max`, `pattern`) để dùng độc lập khi không cần react-hook-form.
- Khi dùng trong `<Form>` wrapper, validate thật sự chạy qua **zod schema** truyền vào `Form` — đây là nguồn validate chính, props ở input chỉ là fallback/native HTML validate.
- `FormField` tự động hiển thị message lỗi dưới input khi field invalid, không cần app tự viết `{errors.field && <span>...}` lặp lại.

### Props validate chuẩn cho `Input`

```ts
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number | string        // dùng cho type="number" | type="date"
  max?: number | string
  pattern?: string              // regex string, ví dụ số điện thoại VN: "^(0|\\+84)[0-9]{9,10}$"
  errorMessage?: string         // override message mặc định khi invalid
}
```

### Ví dụ khai báo schema validate bằng zod (dùng chung cho toàn bộ app)

```ts
// src/lib/validators.ts — các pattern validate dùng lại nhiều nơi
export const patterns = {
  phoneVN: /^(0|\+84)[0-9]{9,10}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  noSpecialChars: /^[a-zA-Z0-9À-ỹ\s]+$/,
}
```

```ts
// Ví dụ dùng trong app: form tạo sản phẩm (grocery-app)
import { z } from 'zod'
import { patterns } from '@your-org/ui-lib/validators'

const productSchema = z.object({
  name: z.string().min(2, 'Tên sản phẩm tối thiểu 2 ký tự').max(100),
  sku: z.string().regex(/^[A-Z0-9-]+$/, 'SKU chỉ gồm chữ hoa, số và dấu gạch ngang'),
  price: z.number().min(1000, 'Giá tối thiểu 1,000đ').max(100_000_000),
  phone: z.string().regex(patterns.phoneVN, 'Số điện thoại không hợp lệ').optional(),
  quantity: z.number().int().min(0).max(9999),
})
```

### Component `Form` + `FormField` (wrapper chuẩn)

```tsx
// src/components/form/form.tsx
import { FormProvider, useForm, type UseFormProps, type FieldValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ZodSchema } from 'zod'

interface FormProps<T extends FieldValues> extends UseFormProps<T> {
  schema: ZodSchema<T>
  onSubmit: (values: T) => void
  children: React.ReactNode
}

export function Form<T extends FieldValues>({ schema, onSubmit, children, ...formProps }: FormProps<T>) {
  const methods = useForm<T>({ resolver: zodResolver(schema), ...formProps })
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  )
}
```

```tsx
// src/components/form/form-field.tsx
import { useFormContext, Controller } from 'react-hook-form'
import { Input, type InputProps } from '../input'
import { cn } from '../../lib/utils'

interface FormFieldProps extends InputProps {
  name: string
  label?: string
}

export function FormField({ name, label, ...inputProps }: FormFieldProps) {
  const { control, formState: { errors } } = useFormContext()
  const error = errors[name]?.message as string | undefined

  return (
    <div className="space-y-xs">
      {label && <label className="text-sm font-medium" htmlFor={name}>{label}</label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input id={name} {...field} {...inputProps} className={cn(error && 'border-destructive')} />
        )}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
```

**Cách app dùng lại (grocery-app, F&B, DocFlow đều dùng chung pattern này):**

```tsx
<Form schema={productSchema} onSubmit={handleCreateProduct}>
  <FormField name="name" label="Tên sản phẩm" required maxLength={100} />
  <FormField name="sku" label="Mã SKU" pattern="^[A-Z0-9-]+$" />
  <FormField name="phone" label="Số điện thoại" pattern={patterns.phoneVN.source} />
  <Button type="submit">Lưu</Button>
</Form>
```

→ Validate rule (min/max/regex/required) khai báo tập trung ở `zod schema` phía app, còn `FormField`/`Input` trong lib chỉ lo hiển thị lỗi và props HTML-level validate cơ bản — tách đúng trách nhiệm: **lib lo UI + hiển thị lỗi, app lo business rule validate**.

**Việc cần làm (bổ sung vào Phase 3 khi build Form):**
- [ ] Cài `react-hook-form`, `zod`, `@hookform/resolvers`
- [ ] Build `Form`, `FormField` theo pattern trên
- [ ] Viết `src/lib/validators.ts` chứa các regex pattern dùng chung (phone VN, email, mã SKU...)
- [ ] Export `patterns` object để app tái sử dụng, tránh mỗi app tự viết regex riêng lẻ

---

## Ghi chú cho Claude Code khi bắt đầu

- Bắt đầu từ Phase 1 → Phase 2.5 → Phase 4 để có pipeline build hoạt động với 1 component (Button) dùng token trước khi build thêm component khác. **Không được bỏ qua Phase 2.5** — component build trước khi có token sẽ phải sửa lại toàn bộ sau này.
- Chỉ đưa vào lib chung các component nằm trong "Danh mục component chuẩn thuộc lib chung" ở trên. Component đặc thù riêng của 1 app thì dùng `npx shadcn add` trực tiếp trong app đó, không đưa vào lib.
- Mọi component mới thêm sau này đều phải tuân thủ quy tắc "chỉ dùng class semantic từ token" ở Phase 2.5 — nếu thiếu token cần dùng, bổ sung vào `tokens.ts` trước, không tạo giá trị rời rạc trong component.
- Khi build tới `Form`/`FormField` (bước 3 trong thứ tự build), làm theo đúng spec ở mục "Spec chi tiết: Form controls + validation props" — không tự thiết kế lại pattern validate khác.
- Sau khi Phase 4 xong và verify được `dist/` build đúng, mới tiếp tục thêm component theo thứ tự ưu tiên ở trên — mỗi component lặp lại pattern: code → story → test → export.
- Phase 5-8 (publish, CI) có thể làm song song sau khi có 2-3 component ổn định, không cần đợi đủ toàn bộ danh sách component.
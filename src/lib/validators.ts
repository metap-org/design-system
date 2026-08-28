// Regex pattern dùng lại nhiều nơi trong app — xem readme.md's
// "Spec chi tiết: Form controls + validation props" cho cách dùng chung với zod schema.
export const patterns = {
  phoneVN: /^(0|\+84)[0-9]{9,10}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  noSpecialChars: /^[a-zA-Z0-9À-ỹ\s]+$/,
} as const

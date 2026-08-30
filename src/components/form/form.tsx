import * as React from 'react'
import { FormProvider, useForm, type UseFormProps, type FieldValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ZodType } from 'zod'

export interface FormProps<T extends FieldValues> extends UseFormProps<T> {
  // Output and input pinned to the same T (no zod .transform()) — matches the
  // Resolver<T, any, T> shape react-hook-form's useForm<T> expects.
  schema: ZodType<T, T>
  onSubmit: (values: T) => void
  children: React.ReactNode
  className?: string
}

export function Form<T extends FieldValues>({
  schema,
  onSubmit,
  children,
  className,
  ...formProps
}: FormProps<T>) {
  const methods = useForm<T>({ resolver: zodResolver(schema), ...formProps })
  return (
    <FormProvider {...methods}>
      <form className={className} onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        {children}
      </form>
    </FormProvider>
  )
}

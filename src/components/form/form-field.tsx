import * as React from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { Input, type InputProps } from '../input'
import { cn } from '../../lib/utils'

export interface FormFieldProps extends Omit<InputProps, 'name'> {
  name: string
  label?: string
}

export function FormField({ name, label, className, ...inputProps }: FormFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  const error = errors[name]?.message as string | undefined

  return (
    <div className="space-y-xs">
      {label && (
        <label className="text-sm font-medium text-foreground" htmlFor={name}>
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            id={name}
            {...field}
            {...inputProps}
            className={cn(error && 'border-destructive', className)}
          />
        )}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

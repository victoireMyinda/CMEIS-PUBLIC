import { cn } from '@/utils/cn'
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'

const fieldClass =
  'w-full rounded-xl border border-line bg-white px-4 py-3 text-base text-ink placeholder:text-muted/80 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 disabled:bg-brand-50'

export function Label({
  htmlFor,
  children,
  required,
}: {
  htmlFor?: string
  children: ReactNode
  required?: boolean
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink">
      {children}
      {required ? <span className="text-red-600"> *</span> : null}
    </label>
  )
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1.5 text-sm text-red-600">{message}</p>
}

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldClass, 'h-12', className)} {...props} />
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(fieldClass, 'min-h-28 resize-y', className)}
      {...props}
    />
  )
}

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(fieldClass, 'h-12', className)} {...props}>
      {children}
    </select>
  )
}

export function FormField({
  label,
  htmlFor,
  required,
  error,
  children,
}: {
  label: string
  htmlFor?: string
  required?: boolean
  error?: string
  children: ReactNode
}) {
  return (
    <div className="w-full">
      <Label htmlFor={htmlFor} required={required}>
        {label}
      </Label>
      {children}
      <FieldError message={error} />
    </div>
  )
}

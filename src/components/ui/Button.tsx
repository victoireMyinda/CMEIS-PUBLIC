import { cn } from '@/utils/cn'
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'accent' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
}

const variants: Record<Variant, string> = {
  primary: 'bg-brand-700 text-white hover:bg-brand-800 active:bg-brand-900',
  secondary:
    'bg-white text-brand-800 border border-line hover:bg-brand-50 active:bg-brand-100',
  ghost: 'bg-transparent text-brand-800 hover:bg-brand-50',
  accent: 'bg-accent-500 text-ink hover:bg-accent-400 active:bg-accent-600',
  danger: 'bg-red-600 text-white hover:bg-red-700',
}

const sizes: Record<Size, string> = {
  sm: 'h-10 px-3 text-sm',
  md: 'h-12 px-4 text-base',
  lg: 'h-14 px-5 text-base',
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  fullWidth,
  type = 'button',
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex touch-target items-center justify-center gap-2 rounded-xl font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

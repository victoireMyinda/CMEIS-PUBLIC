import { cn } from '@/utils/cn'
import type { PropsWithChildren } from 'react'

export function Card({
  children,
  className,
  as: Tag = 'div',
}: PropsWithChildren<{ className?: string; as?: 'div' | 'article' | 'section' }>) {
  return (
    <Tag
      className={cn(
        'overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-elevated shadow-soft',
        className,
      )}
    >
      {children}
    </Tag>
  )
}

export function CardBody({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return <div className={cn('p-4 sm:p-5', className)}>{children}</div>
}

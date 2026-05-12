import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '#/lib/utils'

const alertVariants = cva(
  'relative w-full rounded-xl border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:translate-y-0.5 [&>svg]:text-current',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground border-border',
        destructive:
          'text-destructive bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/40 dark:text-red-400 [&>svg]:text-destructive',
        warning:
          'text-amber-800 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/40 dark:text-amber-300 [&>svg]:text-amber-600',
        info:
          'text-[var(--lagoon-deep)] bg-[rgba(79,184,178,0.08)] border-[rgba(79,184,178,0.3)] dark:text-[var(--lagoon)] [&>svg]:text-[var(--lagoon-deep)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn('col-start-2 font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
}

function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn('col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed', className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }

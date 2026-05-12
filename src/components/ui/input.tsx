import * as React from 'react'
import { cn } from '#/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-[var(--sea-ink-soft)] selection:bg-[rgba(79,184,178,0.24)] selection:text-[var(--sea-ink)] border-[var(--line)] flex h-9 w-full min-w-0 rounded-md border bg-white/60 px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:border-[var(--lagoon-deep)] focus-visible:ring-[3px] focus-visible:ring-[var(--lagoon)]/20',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        'dark:bg-white/5 dark:border-[var(--line)]',
        className,
      )}
      {...props}
    />
  )
}

export { Input }

import { Link } from '@tanstack/react-router'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t border-foreground/15 px-4 pb-14 pt-10 text-(--sea-ink-soft)">
      <div className="page-wrap flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <div>
          <p className="m-0 text-sm font-semibold text-(--sea-ink)">Labut AI</p>
          <p className="m-0 mt-1 text-xs">
            Inteligência de mercado para MEIs do Piauí &copy; {year}
          </p>
        </div>

      </div>
    </footer>
  )
}

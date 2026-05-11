import { Link } from '@tanstack/react-router'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t border-[var(--line)] px-4 pb-14 pt-10 text-[var(--sea-ink-soft)]">
      <div className="page-wrap flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <div>
          <p className="m-0 text-sm font-semibold text-[var(--sea-ink)]">Labut AI</p>
          <p className="m-0 mt-1 text-xs">
            Inteligência de mercado para MEIs do Piauí &copy; {year}
          </p>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <Link to="/" className="no-underline hover:text-[var(--sea-ink)]">Início</Link>
          <Link to="/cadastro" className="no-underline hover:text-[var(--sea-ink)]">Criar conta</Link>
          <Link to="/entrar" className="no-underline hover:text-[var(--sea-ink)]">Entrar</Link>
        </div>
      </div>
    </footer>
  )
}

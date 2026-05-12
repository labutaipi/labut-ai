import { Link } from '@tanstack/react-router'
import { authClient } from '#/lib/auth-client'
import { Button } from '#/components/ui/button'
import {ThemeToggle} from './theme-toggle'

export function Header() {
  const { data: session } = authClient.useSession()

  return (
    <header className="sticky top-0 z-50 border-b border-foreground/15 bg-(--header-bg) px-4 backdrop-blur-lg">
      <nav className="page-wrap flex flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:py-4">
        <h2 className="m-0 shrink-0 text-base font-semibold tracking-tight">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-(--chip-line) bg-(--chip-bg) px-3 py-1.5 text-sm text-(--sea-ink) no-underline shadow-[0_8px_24px_rgba(30,90,72,0.08)] sm:px-4 sm:py-2"
          >
            <span className="h-2 w-2 rounded-full bg-[linear-gradient(90deg,#56c6be,#7ed3bf)]" />
            Labut AI
          </Link>
        </h2>

        {session?.user && (
          <div className="order-3 flex w-full flex-wrap items-center gap-x-4 gap-y-1 pb-1 text-sm font-semibold sm:order-0 sm:w-auto sm:flex-nowrap sm:pb-0">
            <Link
              to="/dashboard"
              className="nav-link"
              activeProps={{ className: 'nav-link is-active' }}
            >
              Painel
            </Link>
            <Link
              to="/dashboard/perfil"
              className="nav-link"
              activeProps={{ className: 'nav-link is-active' }}
            >
              Perfil
            </Link>
          </div>
        )}

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          {session?.user ? (
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-(--sea-ink-soft) sm:block">
                {session.user.name?.split(' ')[0]}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild className="rounded-full">
                <Link to="/entrar">Entrar</Link>
              </Button>
              <Button size="sm" asChild className="rounded-full">
                <Link to="/cadastro" >Criar conta</Link>
              </Button>
            </div>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}

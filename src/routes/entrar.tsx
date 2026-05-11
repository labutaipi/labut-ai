import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { authClient } from '#/lib/auth-client'

export const Route = createFileRoute('/entrar')({
  component: Entrar,
})

function Entrar() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await authClient.signIn.email({
        email: form.email,
        password: form.password,
      })

      if (result.error) {
        setError('E-mail ou senha incorretos.')
        return
      }

      await navigate({ to: '/dashboard' })
    } catch {
      setError('Erro ao entrar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page-wrap flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="island-shell w-full max-w-md rounded-2xl p-8">
        <div className="mb-8 text-center">
          <p className="island-kicker mb-2">Labut AI</p>
          <h1 className="display-title text-3xl font-bold text-[var(--sea-ink)]">
            Bem-vindo de volta
          </h1>
          <p className="mt-2 text-sm text-[var(--sea-ink-soft)]">
            Entre para ver as tendências do seu mercado
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--sea-ink)]">
              E-mail
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="maria@exemplo.com"
              className="w-full rounded-xl border border-[var(--line)] bg-white/60 px-4 py-3 text-sm text-[var(--sea-ink)] placeholder-[var(--sea-ink-soft)] outline-none transition focus:border-[var(--lagoon-deep)] focus:ring-2 focus:ring-[var(--lagoon)]/20 dark:bg-white/5"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--sea-ink)]">
              Senha
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="Sua senha"
              className="w-full rounded-xl border border-[var(--line)] bg-white/60 px-4 py-3 text-sm text-[var(--sea-ink)] placeholder-[var(--sea-ink-soft)] outline-none transition focus:border-[var(--lagoon-deep)] focus:ring-2 focus:ring-[var(--lagoon)]/20 dark:bg-white/5"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[var(--lagoon-deep)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--palm)] disabled:opacity-60"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--sea-ink-soft)]">
          Não tem conta?{' '}
          <Link to="/cadastro" className="font-medium text-[var(--lagoon-deep)]">
            Criar conta grátis
          </Link>
        </p>
      </div>
    </main>
  )
}

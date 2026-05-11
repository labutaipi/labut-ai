import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Suspense, useState } from 'react'
import { orpc, client } from '#/orpc/client'
import { authClient } from '#/lib/auth-client'
import { getSegmentBySlug } from '#/lib/segments'
import { getCityBySlug } from '#/lib/cities'

export const Route = createFileRoute('/dashboard/perfil')({
  component: PerfilPage,
})

function PerfilPage() {
  return (
    <Suspense fallback={<div className="page-wrap px-4 pt-8"><div className="h-48 animate-pulse rounded-2xl bg-[var(--line)]" /></div>}>
      <PerfilContent />
    </Suspense>
  )
}

function PerfilContent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: user } = useSuspenseQuery(orpc.user.me.queryOptions({ input: {} }))
  const [name, setName] = useState(user.name)
  const [businessName, setBusinessName] = useState(user.businessName ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const segment = user.segmentSlug ? getSegmentBySlug(user.segmentSlug as any) : null
  const city = user.citySlug ? getCityBySlug(user.citySlug as any) : null

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      await client.user.update({ name, businessName: businessName || undefined })
      await queryClient.invalidateQueries(orpc.user.me.queryOptions({ input: {} }))
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  async function handleSignOut() {
    await authClient.signOut()
    await navigate({ to: '/' })
  }

  return (
    <main className="page-wrap px-4 pb-12 pt-8">
      <div className="mb-8">
        <p className="island-kicker mb-1">Configurações</p>
        <h1 className="text-2xl font-bold text-[var(--sea-ink)]">Seu perfil</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Dados pessoais */}
        <div className="island-shell rounded-2xl p-6">
          <h2 className="mb-4 text-base font-semibold text-[var(--sea-ink)]">Dados pessoais</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--sea-ink)]">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-[var(--line)] bg-white/60 px-4 py-3 text-sm outline-none transition focus:border-[var(--lagoon-deep)] focus:ring-2 focus:ring-[var(--lagoon)]/20 dark:bg-white/5"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--sea-ink)]">Nome do negócio</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Ex: Salão da Maria"
                className="w-full rounded-xl border border-[var(--line)] bg-white/60 px-4 py-3 text-sm outline-none transition focus:border-[var(--lagoon-deep)] focus:ring-2 focus:ring-[var(--lagoon)]/20 dark:bg-white/5"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--sea-ink)]">E-mail</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full rounded-xl border border-[var(--line)] bg-white/30 px-4 py-3 text-sm text-[var(--sea-ink-soft)] dark:bg-white/5"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[var(--lagoon-deep)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--palm)] disabled:opacity-60"
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
            {saved && (
              <p className="text-sm text-green-600">Alterações salvas com sucesso.</p>
            )}
          </form>
        </div>

        {/* Segmento e cidade */}
        <div className="island-shell rounded-2xl p-6">
          <h2 className="mb-4 text-base font-semibold text-[var(--sea-ink)]">Seu mercado</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-white/40 px-4 py-3 dark:bg-white/5">
              <span className="text-sm text-[var(--sea-ink-soft)]">Segmento</span>
              <span className="text-sm font-medium text-[var(--sea-ink)]">
                {segment ? `${segment.icon} ${segment.label}` : '—'}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/40 px-4 py-3 dark:bg-white/5">
              <span className="text-sm text-[var(--sea-ink-soft)]">Cidade</span>
              <span className="text-sm font-medium text-[var(--sea-ink)]">
                {city ? city.label : '—'}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/40 px-4 py-3 dark:bg-white/5">
              <span className="text-sm text-[var(--sea-ink-soft)]">Plano</span>
              <span className="text-sm font-medium text-[var(--sea-ink)]">
                {user.plan === 'PREMIUM' ? '⭐ Premium' : 'Gratuito'}
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate({ to: '/onboarding' })}
            className="mt-4 text-sm text-[var(--lagoon-deep)] underline-offset-2 hover:underline"
          >
            Alterar segmento ou cidade
          </button>
        </div>
      </div>

      {/* Sair */}
      <div className="mt-8 border-t border-[var(--line)] pt-8">
        <button
          onClick={handleSignOut}
          className="rounded-xl border border-[var(--line)] px-5 py-2.5 text-sm font-medium text-[var(--sea-ink-soft)] transition hover:border-red-300 hover:text-red-600"
        >
          Sair da conta
        </button>
      </div>
    </main>
  )
}

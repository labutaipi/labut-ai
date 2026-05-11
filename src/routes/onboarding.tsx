import { createFileRoute, useNavigate, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { authClient } from '#/lib/auth-client'
import { client } from '#/orpc/client'
import SegmentPicker from '#/components/onboarding/SegmentPicker'
import CityPicker from '#/components/onboarding/CityPicker'
import type { SegmentSlug } from '#/lib/segments'
import type { CitySlug } from '#/lib/cities'

export const Route = createFileRoute('/onboarding')({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession()
    if (!session) throw redirect({ to: '/cadastro' })
  },
  component: Onboarding,
})

function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2>(1)
  const [segmentSlug, setSegmentSlug] = useState<SegmentSlug | null>(null)
  const [citySlug, setCitySlug] = useState<CitySlug | null>(null)
  const [businessName, setBusinessName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleFinish() {
    if (!segmentSlug || !citySlug) return
    setLoading(true)
    setError('')

    try {
      await client.onboarding.save({
        segmentSlug,
        citySlug,
        businessName: businessName.trim() || undefined,
      })
      await navigate({ to: '/dashboard' })
    } catch {
      setError('Erro ao salvar. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <main className="page-wrap flex min-h-[80vh] flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8 flex items-center gap-3">
          <div
            className={`h-2 flex-1 rounded-full transition-all ${step >= 1 ? 'bg-[var(--lagoon-deep)]' : 'bg-[var(--line)]'}`}
          />
          <div
            className={`h-2 flex-1 rounded-full transition-all ${step >= 2 ? 'bg-[var(--lagoon-deep)]' : 'bg-[var(--line)]'}`}
          />
        </div>

        {step === 1 && (
          <div>
            <p className="island-kicker mb-3">Passo 1 de 2</p>
            <h1 className="display-title mb-2 text-3xl font-bold text-[var(--sea-ink)]">
              Qual é o seu segmento?
            </h1>
            <p className="mb-8 text-[var(--sea-ink-soft)]">
              Escolha a área do seu negócio para ver as tendências certas.
            </p>

            <SegmentPicker selected={segmentSlug} onSelect={setSegmentSlug} />

            <button
              onClick={() => segmentSlug && setStep(2)}
              disabled={!segmentSlug}
              className="mt-8 w-full rounded-xl bg-[var(--lagoon-deep)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--palm)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continuar
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="island-kicker mb-3">Passo 2 de 2</p>
            <h1 className="display-title mb-2 text-3xl font-bold text-[var(--sea-ink)]">
              Em qual cidade você atende?
            </h1>
            <p className="mb-8 text-[var(--sea-ink-soft)]">
              Vamos mostrar as tendências da sua cidade no Piauí.
            </p>

            <div className="mb-6">
              <label className="mb-1.5 block text-sm font-medium text-[var(--sea-ink)]">
                Nome do seu negócio (opcional)
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Ex: Salão da Maria"
                className="w-full rounded-xl border border-[var(--line)] bg-white/60 px-4 py-3 text-sm text-[var(--sea-ink)] placeholder-[var(--sea-ink-soft)] outline-none transition focus:border-[var(--lagoon-deep)] focus:ring-2 focus:ring-[var(--lagoon)]/20 dark:bg-white/5"
              />
            </div>

            <CityPicker selected={citySlug} onSelect={setCitySlug} />

            {error && (
              <p className="mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </p>
            )}

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="rounded-xl border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--sea-ink)] transition hover:bg-white/60"
              >
                Voltar
              </button>
              <button
                onClick={handleFinish}
                disabled={!citySlug || loading}
                className="flex-1 rounded-xl bg-[var(--lagoon-deep)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--palm)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? 'Salvando...' : 'Ver meu painel'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

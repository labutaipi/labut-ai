import { createFileRoute, useNavigate, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { authClient } from '#/lib/auth-client'
import { client } from '#/orpc/client'
import SegmentPicker from '#/components/onboarding/SegmentPicker'
import CityPicker from '#/components/onboarding/CityPicker'
import type { SegmentSlug } from '#/lib/segments'
import type { CitySlug } from '#/lib/cities'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Alert, AlertDescription } from '#/components/ui/alert'
import { Badge } from '#/components/ui/badge'
import { cn } from '#/lib/utils'

export const Route = createFileRoute('/onboarding')({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession()
    if (!session) throw redirect({ to: '/sign-in' })
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
            className={cn(
              'h-2 flex-1 rounded-full transition-all',
              step >= 1 ? 'bg-(--lagoon-deep)' : 'bg-(--line)',
            )}
          />
          <div  
            className={cn(
              'h-2 flex-1 rounded-full transition-all',
              step >= 2 ? 'bg-(--lagoon-deep)' : 'bg-(--line)',
            )}
          />
        </div>

        {step === 1 && (
          <div>
            <Badge variant="kicker" className="mb-3">Passo 1 de 2</Badge>
            <h1 className="display-title mb-2 text-3xl font-bold text-(--sea-ink)">
              Qual é o seu segmento?
            </h1>
            <p className="mb-8 text-(--sea-ink-soft)">
              Escolha a área do seu negócio para ver as tendências certas.
            </p>

            <SegmentPicker selected={segmentSlug} onSelect={setSegmentSlug} />

            <Button
              onClick={() => segmentSlug && setStep(2)}
              disabled={!segmentSlug}
              className="mt-8 w-full h-11 rounded-xl"
            >
              Continuar
            </Button>
          </div>
        )}

        {step === 2 && (
          <div>
            <Badge variant="kicker" className="mb-3">Passo 2 de 2</Badge>
            <h1 className="display-title mb-2 text-3xl font-bold text-(--sea-ink)">
              Em qual cidade você atende?
            </h1>
            <p className="mb-8 text-(--sea-ink-soft)">
              Vamos mostrar as tendências da sua cidade no Piauí.
            </p>

            <div className="mb-6 space-y-1.5">
              <Label htmlFor="businessName">Nome do seu negócio (opcional)</Label>
              <Input
                id="businessName"
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Ex: Salão da Maria"
                className="h-11 rounded-xl"
              />
            </div>

            <CityPicker selected={citySlug} onSelect={setCitySlug} />

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="mt-8 flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="rounded-xl h-11"
              >
                Voltar
              </Button>
              <Button
                onClick={handleFinish}
                disabled={!citySlug || loading}
                className="flex-1 h-11 rounded-xl"
              >
                {loading ? 'Salvando...' : 'Ver meu painel'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

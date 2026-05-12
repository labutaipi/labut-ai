import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { authClient } from '#/lib/auth-client'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '#/components/ui/card'
import { Alert, AlertDescription } from '#/components/ui/alert'
import { Badge } from '#/components/ui/badge'

export const Route = createFileRoute('/cadastro')({
  component: Cadastro,
})

function Cadastro() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await authClient.signUp.email({
        name: form.name,
        email: form.email,
        password: form.password,
      })

      if (result.error) {
        setError(result.error.message ?? 'Erro ao criar conta. Tente novamente.')
        return
      }

      await navigate({ to: '/onboarding' })
    } catch {
      setError('Erro ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page-wrap flex min-h-[80vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md gap-0 py-0">
        <CardHeader className="px-8 pt-8 pb-0">
          <div className="mb-2 text-center">
            <Badge variant="kicker" className="mb-3">Labut AI</Badge>
            <CardTitle className="display-title text-3xl font-bold text-(--sea-ink)">
              Crie sua conta
            </CardTitle>
            <CardDescription className="mt-2">
              Inteligência de mercado para o seu negócio no Piauí
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-8 pt-6 pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Seu nome</Label>
              <Input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Maria Silva"
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="maria@exemplo.com"
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="Mínimo 8 caracteres"
                className="h-11 rounded-xl"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl"
            >
              {loading ? 'Criando conta...' : 'Criar conta grátis'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-(--sea-ink-soft)">
            Já tem conta?{' '}
            <Link to="/entrar" className="font-medium text-(--lagoon-deep)">
              Entrar
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}

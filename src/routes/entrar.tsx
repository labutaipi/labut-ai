import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { authClient } from '#/lib/auth-client'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '#/components/ui/card'
import { Alert, AlertDescription } from '#/components/ui/alert'
import { Badge } from '#/components/ui/badge'

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
      <Card className="w-full max-w-md gap-0 py-0">
        <CardHeader className="px-8 pt-8 pb-0">
          <div className="mb-2 text-center">
            <Badge variant="kicker" className="mb-3">Labut AI</Badge>
            <CardTitle className="display-title text-3xl font-bold text-(--sea-ink)">
              Bem-vindo de volta
            </CardTitle>
            <CardDescription className="mt-2">
              Entre para ver as tendências do seu mercado
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-8 pt-6 pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
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
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="Sua senha"
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
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-(--sea-ink-soft)">
            Não tem conta?{' '}
            <Link to="/cadastro" className="font-medium text-(--lagoon-deep)">
              Criar conta grátis
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}

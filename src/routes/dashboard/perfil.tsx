import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Suspense, useState } from "react";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { authClient } from "#/lib/auth-client";
import { getCityBySlug } from "#/lib/cities";
import { getSegmentBySlug } from "#/lib/segments";
import { client, orpc } from "#/orpc/client";

export const Route = createFileRoute("/dashboard/perfil")({
  component: PerfilPage,
});

function PerfilPage() {
  return (
    <Suspense
      fallback={
        <div className="page-wrap px-4 pt-8">
          <div className="h-48 animate-pulse rounded-2xl bg-(--line)" />
        </div>
      }
    >
      <PerfilContent />
    </Suspense>
  );
}

function PerfilContent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user } = useSuspenseQuery(
    orpc.user.me.queryOptions({ input: {} }),
  );
  const [name, setName] = useState(user.name);
  const [businessName, setBusinessName] = useState(user.businessName ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const segment = user.segmentSlug
    ? getSegmentBySlug(user.segmentSlug as any)
    : null;
  const city = user.citySlug ? getCityBySlug(user.citySlug as any) : null;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await client.user.update({
        name,
        businessName: businessName || undefined,
      });
      await queryClient.invalidateQueries(
        orpc.user.me.queryOptions({ input: {} }),
      );
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    await authClient.signOut();
    await navigate({ to: "/" });
  }

  return (
    <main className="page-wrap px-4 pb-12 pt-8">
      <div className="mb-8">
        <Badge variant="kicker" className="mb-1">
          Configurações
        </Badge>
        <h1 className="text-2xl font-bold text-[var(--sea-ink)]">Seu perfil</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Dados pessoais */}
        <Card className="gap-0 py-0">
          <CardHeader className="px-6 pt-6 pb-0">
            <CardTitle>Dados pessoais</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-4">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="businessName">Nome do negócio</Label>
                <Input
                  id="businessName"
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Ex: Salão da Maria"
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="flex items-center gap-3">
                <Button type="submit" disabled={saving} className="rounded-xl">
                  {saving ? "Salvando..." : "Salvar"}
                </Button>
                {saved && (
                  <span className="text-sm text-green-600">
                    Alterações salvas com sucesso.
                  </span>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Segmento e cidade */}
        <Card className="gap-0 py-0">
          <CardHeader className="px-6 pt-6 pb-0">
            <CardTitle>Seu mercado</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-white/40 px-4 py-3 dark:bg-white/5">
                <span className="text-sm text-[var(--sea-ink-soft)]">
                  Segmento
                </span>
                <span className="text-sm font-medium text-[var(--sea-ink)]">
                  {segment ? `${segment.icon} ${segment.label}` : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/40 px-4 py-3 dark:bg-white/5">
                <span className="text-sm text-[var(--sea-ink-soft)]">
                  Cidade
                </span>
                <span className="text-sm font-medium text-[var(--sea-ink)]">
                  {city ? city.label : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/40 px-4 py-3 dark:bg-white/5">
                <span className="text-sm text-[var(--sea-ink-soft)]">
                  Plano
                </span>
                <span className="text-sm font-medium text-[var(--sea-ink)]">
                  {user.plan === "PREMIUM" ? "⭐ Premium" : "Gratuito"}
                </span>
              </div>
            </div>
            <Button
              variant="link"
              onClick={() => navigate({ to: "/onboarding" })}
              className="mt-4 px-0 text-sm h-auto"
            >
              Alterar segmento ou cidade
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Sair */}
      <div className="mt-8 border-t border-[var(--line)] pt-8">
        <Button
          variant="outline"
          onClick={handleSignOut}
          className="rounded-xl hover:border-red-300 hover:text-red-600"
        >
          Sair da conta
        </Button>
      </div>
    </main>
  );
}

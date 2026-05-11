import { createFileRoute, Link } from '@tanstack/react-router'
import { authClient } from '#/lib/auth-client'
import { SEGMENTS } from '#/lib/segments'

export const Route = createFileRoute('/')({ component: LandingPage })

function LandingPage() {
  const { data: session } = authClient.useSession()

  return (
    <main className="page-wrap px-4 pb-16 pt-14">
      {/* Hero */}
      <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-12 text-center sm:px-10 sm:py-16">
        <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />

        <p className="island-kicker mb-3">Labut AI</p>
        <h1 className="display-title mx-auto mb-5 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-[var(--sea-ink)] sm:text-5xl">
          O mercado do Piauí na palma da sua mão
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-base text-[var(--sea-ink-soft)] sm:text-lg">
          Veja o que as pessoas estão buscando no Google para o seu tipo de negócio, na sua cidade — de graça.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {session?.user ? (
            <Link
              to="/dashboard"
              className="rounded-full bg-[var(--lagoon-deep)] px-6 py-3 text-sm font-semibold text-white no-underline transition hover:-translate-y-0.5 hover:bg-[var(--palm)]"
            >
              Ver meu painel →
            </Link>
          ) : (
            <>
              <Link
                to="/cadastro"
                className="rounded-full bg-[var(--lagoon-deep)] px-6 py-3 text-sm font-semibold text-white no-underline transition hover:-translate-y-0.5 hover:bg-[var(--palm)]"
              >
                Criar conta grátis
              </Link>
              <Link
                to="/entrar"
                className="rounded-full border border-[rgba(23,58,64,0.2)] bg-white/50 px-6 py-3 text-sm font-semibold text-[var(--sea-ink)] no-underline transition hover:-translate-y-0.5 hover:border-[rgba(23,58,64,0.35)]"
              >
                Já tenho conta
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Segmentos */}
      <section className="mt-12">
        <p className="island-kicker mb-3 text-center">Segmentos disponíveis</p>
        <h2 className="mb-8 text-center text-2xl font-bold text-[var(--sea-ink)]">
          Para o seu tipo de negócio
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SEGMENTS.map((segment, index) => (
            <article
              key={segment.slug}
              className="island-shell feature-card rise-in rounded-2xl p-6"
              style={{ animationDelay: `${index * 80 + 100}ms` }}
            >
              <span className="mb-3 block text-3xl">{segment.icon}</span>
              <h3 className="mb-2 text-base font-semibold text-[var(--sea-ink)]">{segment.label}</h3>
              <p className="text-sm text-[var(--sea-ink-soft)]">
                {segment.keywords.slice(0, 3).join(', ')} e mais
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Como funciona */}
      <section className="island-shell mt-12 rounded-2xl p-8">
        <p className="island-kicker mb-3">Como funciona</p>
        <h2 className="mb-8 text-2xl font-bold text-[var(--sea-ink)]">Simples assim</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { num: '1', title: 'Crie sua conta', desc: 'Cadastro grátis com e-mail e senha. Sem cartão de crédito.' },
            { num: '2', title: 'Escolha seu segmento', desc: 'Selecione a área do seu negócio e a sua cidade no Piauí.' },
            { num: '3', title: 'Veja as tendências', desc: 'Acompanhe o que as pessoas buscam e aproveite as oportunidades.' },
          ].map((step) => (
            <div key={step.num} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--lagoon-deep)] text-sm font-bold text-white">
                {step.num}
              </span>
              <div>
                <h3 className="mb-1 text-sm font-semibold text-[var(--sea-ink)]">{step.title}</h3>
                <p className="text-sm text-[var(--sea-ink-soft)]">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      {!session?.user && (
        <section className="mt-12 text-center">
          <p className="mb-4 text-base text-[var(--sea-ink-soft)]">
            Mais de 15 cidades do Piauí. Dados atualizados duas vezes por dia.
          </p>
          <Link
            to="/cadastro"
            className="inline-block rounded-full bg-[var(--lagoon-deep)] px-8 py-3.5 text-sm font-semibold text-white no-underline transition hover:-translate-y-0.5 hover:bg-[var(--palm)]"
          >
            Começar agora — é grátis
          </Link>
        </section>
      )}
    </main>
  )
}

# CLAUDE.md — Arquitetura do Projeto: Plataforma de BI para MEIs do Piauí

> Este documento é o guia de arquitetura para a Claude Code. Leia-o integralmente antes de criar qualquer arquivo, rota, componente ou schema. Todas as decisões técnicas aqui descritas foram deliberadas e não devem ser alteradas sem justificativa explícita.

---

## 1. Visão Geral do Produto

Plataforma SaaS de inteligência de mercado para Microempreendedores Individuais (MEIs) do **estado do Piauí**, com recorte por cidade. O produto exibe tendências de busca do segmento do MEI na sua cidade, usando dados do Google Trends via SerpAPI com cache compartilhado por segmento + cidade.

**Escopo geográfico:** Estado do Piauí — cidades listadas em `lib/cities.ts`.

**Público-alvo:** MEIs piauienses dos segmentos de Beleza, Alimentação, Manutenção, Moda e Serviços Gerais.

**Modelo de negócio:** Freemium. Plano gratuito com dashboard de tendências de mercado. Plano premium com funcionalidades adicionais (definidas em fases futuras).

**Princípio de design central:** A regra dos 5 segundos — o usuário deve entender a mensagem principal do painel em menos de 5 segundos. Nada de jargões técnicos. Linguagem simples, voltada para quem empreende sozinho.

---

## 2. Stack Tecnológica (Imutável)

| Camada | Tecnologia | Motivo |
|---|---|---|
| Framework | TanStack Start | Full-stack, SSR, TanStack Router, Vite/Vinxi |
| Autenticação | Better Auth | Sessões, email/senha, extensível para OAuth futuro |
| API interna | oRPC | Tipagem end-to-end entre server functions e cliente |
| ORM | Prisma | Abstração de banco, migrations, type-safety |
| Banco de dados | Neon DB (PostgreSQL serverless) | Serverless-friendly, free tier, connection pooling nativo |
| Tendências de mercado | SerpAPI | Google Trends com resposta JSON estável |
| Jobs agendados | Inngest | Cron jobs serverless para atualização de cache |
| Estilização | Tailwind CSS | Mobile-first, utilitários |
| Validação | Zod | Validação de inputs nas procedures oRPC e formulários |

**Não usar:** Next.js, Redux, Context API global para dados de servidor, axios (usar fetch nativo), qualquer ORM alternativo ao Prisma, Vercel Cron.

---

## 3. Estrutura de Diretórios

```
/
├── app/
│   ├── routes/
│   │   ├── __root.tsx           # Layout raiz (providers, fonts)
│   │   ├── index.tsx            # Landing page
│   │   ├── cadastro.tsx         # Registro com email + senha
│   │   ├── onboarding.tsx       # Seleção de segmento + cidade
│   │   └── dashboard/
│   │       ├── index.tsx        # Dashboard principal — tendências
│   │       └── perfil.tsx       # Perfil do MEI + configurações
│   ├── client.tsx               # Entry point do cliente
│   ├── router.tsx               # Configuração do TanStack Router
│   └── ssr.tsx                  # Entry point do servidor (SSR)
│
├── server/
│   ├── auth.ts                  # Configuração do Better Auth
│   ├── db.ts                    # Instância singleton do Prisma
│   ├── inngest.ts               # Cliente e funções Inngest
│   ├── orpc.ts                  # Inicialização oRPC + middlewares
│   └── routers/
│       ├── index.ts             # Router raiz — combina sub-routers
│       ├── trends.ts            # Procedures SerpAPI (lê cache ou busca)
│       ├── onboarding.ts        # Salva segmento + cidade do usuário
│       └── user.ts              # Dados do perfil do usuário
│
├── lib/
│   ├── segments.ts              # Constantes de segmentos + tipos TypeScript
│   └── cities.ts                # Constantes de cidades do Piauí + geo codes
│
├── components/
│   ├── ui/                      # Componentes base (Button, Card, Badge)
│   ├── charts/
│   │   ├── TrendChart.tsx       # Gráfico de linha — interesse ao longo do tempo
│   │   └── RegionChart.tsx      # Interesse por sub-região dentro do Piauí
│   ├── dashboard/
│   │   ├── KpiCard.tsx          # Card de métrica com variação (↑↓)
│   │   └── RelatedQueries.tsx   # Lista de queries relacionadas em alta
│   └── onboarding/
│       ├── SegmentPicker.tsx    # Seletor visual de segmento
│       └── CityPicker.tsx       # Seletor de cidade do Piauí
│
├── prisma/
│   └── schema.prisma
│
└── app.config.ts                # Configuração do TanStack Start / Vinxi
```

---

## 4. Constantes Imutáveis

### 4.1 Segmentos (`lib/segments.ts`)

Segmentos são dados **imutáveis** — não mudam sem um novo deploy. Vivem como constantes TypeScript, nunca no banco de dados.

```typescript
// lib/segments.ts

export const SEGMENTS = [
  {
    slug: "salao-beleza",
    label: "Salão de Beleza",
    icon: "✂️",
    keywords: [
      "salão de beleza",
      "corte de cabelo",
      "manicure",
      "escova progressiva",
      "coloração cabelo",
    ],
  },
  {
    slug: "alimentacao",
    label: "Alimentação",
    icon: "🍽️",
    keywords: [
      "marmita",
      "delivery comida",
      "lanchonete",
      "comida caseira",
      "salgado",
    ],
  },
  {
    slug: "manutencao",
    label: "Manutenção e Reparos",
    icon: "🔧",
    keywords: [
      "conserto de celular",
      "eletricista residencial",
      "encanador",
      "manutenção ar condicionado",
      "marido de aluguel",
    ],
  },
  {
    slug: "moda",
    label: "Moda e Vestuário",
    icon: "👗",
    keywords: [
      "roupas femininas",
      "brechó",
      "moda plus size",
      "roupa sob medida",
      "costureira",
    ],
  },
  {
    slug: "servicos-gerais",
    label: "Serviços Gerais",
    icon: "🏠",
    keywords: [
      "faxina",
      "limpeza residencial",
      "jardinagem",
      "personal organizer",
      "diarista",
    ],
  },
] as const;

export type SegmentSlug = (typeof SEGMENTS)[number]["slug"];
export type Segment     = (typeof SEGMENTS)[number];

export function getSegmentBySlug(slug: SegmentSlug): Segment {
  return SEGMENTS.find((s) => s.slug === slug)!;
}

export function getSegmentKeywords(slug: SegmentSlug): string[] {
  return getSegmentBySlug(slug).keywords;
}

export function isValidSegmentSlug(slug: string): slug is SegmentSlug {
  return SEGMENTS.some((s) => s.slug === slug);
}
```

### 4.2 Cidades do Piauí (`lib/cities.ts`)

Somente Teresina tem geo code próprio no Google Trends. As demais usam `BR-PI` com fallback gracioso — o sistema tenta cidade e cai para estado se não houver dados suficientes.

```typescript
// lib/cities.ts

export const PIAUI_CITIES = [
  { slug: "teresina",            label: "Teresina",            geoCode: "BR-PI-TEI" },
  { slug: "parnaiba",            label: "Parnaíba",            geoCode: "BR-PI" },
  { slug: "picos",               label: "Picos",               geoCode: "BR-PI" },
  { slug: "floriano",            label: "Floriano",            geoCode: "BR-PI" },
  { slug: "piripiri",            label: "Piripiri",            geoCode: "BR-PI" },
  { slug: "campo-maior",         label: "Campo Maior",         geoCode: "BR-PI" },
  { slug: "sao-raimundo-nonato", label: "São Raimundo Nonato", geoCode: "BR-PI" },
  { slug: "barras",              label: "Barras",              geoCode: "BR-PI" },
  { slug: "oeiras",              label: "Oeiras",              geoCode: "BR-PI" },
  { slug: "esperantina",         label: "Esperantina",         geoCode: "BR-PI" },
  { slug: "jose-de-freitas",     label: "José de Freitas",     geoCode: "BR-PI" },
  { slug: "urucui",              label: "Uruçuí",              geoCode: "BR-PI" },
  { slug: "corrente",            label: "Corrente",            geoCode: "BR-PI" },
  { slug: "bom-jesus",           label: "Bom Jesus",           geoCode: "BR-PI" },
  { slug: "altos",               label: "Altos",               geoCode: "BR-PI" },
] as const;

export type CitySlug = (typeof PIAUI_CITIES)[number]["slug"];
export type City     = (typeof PIAUI_CITIES)[number];

export function getCityBySlug(slug: CitySlug): City {
  return PIAUI_CITIES.find((c) => c.slug === slug)!;
}

export function getCityGeoCode(slug: CitySlug): string {
  return getCityBySlug(slug).geoCode;
}

export function isValidCitySlug(slug: string): slug is CitySlug {
  return PIAUI_CITIES.some((c) => c.slug === slug);
}
```

**Regra:** Nenhuma dessas constantes vai para o banco. `User` armazena apenas `segmentSlug` e `citySlug` como strings simples.

---

## 5. Schema Prisma (Banco de Dados)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ─────────────────────────────────────────
// AUTENTICAÇÃO (Better Auth — não alterar)
// ─────────────────────────────────────────

model User {
  id            String   @id @default(cuid())
  name          String
  email         String   @unique
  emailVerified Boolean  @default(false)
  image         String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Dados do negócio do MEI
  businessName  String?
  segmentSlug   String?  // "salao-beleza" | "alimentacao" | ... (ver lib/segments.ts)
  citySlug      String?  // "teresina" | "parnaiba" | ...      (ver lib/cities.ts)
  plan          Plan     @default(FREE)

  // Sem relations para segmento ou cidade — são constantes em lib/
  sessions      Session[]
  accounts      Account[]
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Account {
  id                   String    @id @default(cuid())
  userId               String
  accountId            String
  providerId           String
  accessToken          String?   @db.Text
  refreshToken         String?   @db.Text
  accessTokenExpiresAt DateTime?
  scope                String?   @db.Text
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt

  user                 User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([providerId, accountId])
}

model Verification {
  id         String   @id @default(cuid())
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

// ─────────────────────────────────────────
// CACHE DE TENDÊNCIAS
// Chave: segmentSlug + citySlug
// UMA entrada serve TODOS os usuários do mesmo segmento + cidade
// ─────────────────────────────────────────

model SegmentTrendsCache {
  id           String   @id @default(cuid())
  segmentSlug  String   // "salao-beleza", "alimentacao", etc.
  citySlug     String   // "teresina", "parnaiba", etc.
  dataType     String   // "interest_over_time" | "by_region" | "related_queries"
  geoUsed      String   // geo code efetivamente usado: "BR-PI-TEI" ou "BR-PI" (fallback)
  payload      Json
  fetchedAt    DateTime @default(now())
  expiresAt    DateTime // TTL: 12 horas

  @@unique([segmentSlug, citySlug, dataType])
}

// ─────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────

enum Plan {
  FREE
  PREMIUM
}
```

---

## 6. Configuração do Better Auth

```typescript
// server/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),

  emailAndPassword: {
    enabled: true, // MVP usa email + senha, sem OAuth obrigatório
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 dias
    updateAge:  60 * 60 * 24,
  },
});
```

**Nota:** OAuth com Google (para Business Profile e Search Console) está desabilitado no MVP. A autenticação é feita com email e senha. OAuth pode ser adicionado em fases futuras sem alterar o schema — Better Auth suporta múltiplos providers na mesma tabela `Account`.

---

## 7. Configuração do oRPC com TanStack Start

No TanStack Start, o oRPC é exposto via uma server function que atua como handler HTTP, registrada como rota da API no Vinxi.

```typescript
// server/orpc.ts
import { os } from "@orpc/server";
import { auth } from "./auth";
import { prisma } from "./db";

export const publicProcedure = os;

export const protectedProcedure = os.middleware(async ({ context, next }) => {
  const session = await auth.api.getSession({
    headers: context.request.headers,
  });
  if (!session) throw new Error("UNAUTHORIZED");
  return next({ context: { ...context, session, userId: session.user.id } });
});

export const premiumProcedure = protectedProcedure.middleware(
  async ({ context, next }) => {
    const user = await prisma.user.findUnique({ where: { id: context.userId } });
    if (user?.plan !== "PREMIUM") throw new Error("UPGRADE_REQUIRED");
    return next({ context });
  }
);
```

```typescript
// server/routers/index.ts
import { os } from "@orpc/server";
import { trendsRouter }     from "./trends";
import { onboardingRouter } from "./onboarding";
import { userRouter }       from "./user";

export const appRouter = os.router({
  trends:     trendsRouter,
  onboarding: onboardingRouter,
  user:       userRouter,
});

export type AppRouter = typeof appRouter;
```

```typescript
// app/routes/api/orpc.$.ts  ← rota coringa do TanStack Start para o handler oRPC
import { createServerFileRoute } from "@tanstack/start/server";
import { RPCHandler } from "@orpc/server/fetch";
import { appRouter } from "../../../server/routers";

const handler = new RPCHandler(appRouter);

export const ServerRoute = createServerFileRoute("/api/orpc/$").methods({
  GET:  (ctx) => handler.handle(ctx.request),
  POST: (ctx) => handler.handle(ctx.request),
});
```

---

## 8. Fluxo da Aplicação (MVP)

```
1. MEI acessa a plataforma
   → Cadastro com email + senha (Better Auth)

2. Onboarding
   → Seleciona segmento  (SegmentPicker — dados de lib/segments.ts)
   → Seleciona cidade PI (CityPicker    — dados de lib/cities.ts)
   → Salva segmentSlug + citySlug no User via oRPC

3. Dashboard carrega
   → Procedure trends.get() verifica SegmentTrendsCache
      → Cache válido (expiresAt > now): retorna payload instantâneo
      → Cache ausente ou expirado:
           → Busca geoCode da cidade (lib/cities.ts)
           → Chama SerpAPI com geoCode
           → Se payload vazio (cidade sem dados): refaz com "BR-PI" (fallback)
           → Salva no cache com geoUsed registrado
           → Retorna payload

4. Dashboard exibe
   → Gráfico de interesse ao longo do tempo (90 dias)
   → Interesse por sub-região dentro do Piauí
   → Queries relacionadas em alta no segmento
   → Se geoUsed === "BR-PI" e city !== "teresina":
        exibe aviso: "Exibindo dados do Piauí — sua cidade ainda tem
                      poucos dados para análise individual."

5. Inngest (cron a cada 12h)
   → Lista combinações únicas de segmentSlug + citySlug
     com pelo menos 1 usuário ativo (logou nos últimos 7 dias)
   → Para cada combinação: busca SerpAPI → atualiza cache
   → 1 chamada por combinação ativa, nunca por usuário
```

---

## 9. Inngest — Jobs Agendados

```typescript
// server/inngest.ts
import { Inngest } from "inngest";
import { prisma } from "./db";
import { fetchSegmentTrends } from "../lib/serpapi/trends";

export const inngest = new Inngest({ id: "mei-piaui" });

// Atualiza o cache de tendências para todas as combinações ativas
export const updateTrendsCache = inngest.createFunction(
  { id: "update-trends-cache" },
  { cron: "0 6,18 * * *" }, // 6h e 18h todos os dias
  async ({ step }) => {

    // Busca combinações com usuários ativos (logaram nos últimos 7 dias)
    const activeCombos = await step.run("fetch-active-combos", async () => {
      return prisma.$queryRaw<{ segmentSlug: string; citySlug: string }[]>`
        SELECT DISTINCT u."segmentSlug", u."citySlug"
        FROM "User" u
        INNER JOIN "Session" s ON s."userId" = u.id
        WHERE s."expiresAt" > NOW()
          AND u."segmentSlug" IS NOT NULL
          AND u."citySlug"    IS NOT NULL
      `;
    });

    // Atualiza cada combinação em paralelo (com throttle automático do Inngest)
    await step.run("refresh-caches", async () => {
      for (const { segmentSlug, citySlug } of activeCombos) {
        await fetchSegmentTrends(
          segmentSlug as any,
          citySlug    as any,
          { forceRefresh: true }
        );
      }
    });

    return { updated: activeCombos.length };
  }
);
```

```typescript
// app/routes/api/inngest.ts  ← endpoint que o Inngest chama
import { createServerFileRoute } from "@tanstack/start/server";
import { serve } from "inngest/fetch";
import { inngest, updateTrendsCache } from "../../../server/inngest";

const handler = serve({
  client: inngest,
  functions: [updateTrendsCache],
});

export const ServerRoute = createServerFileRoute("/api/inngest").methods({
  GET:  handler,
  POST: handler,
  PUT:  handler,
});
```

---

## 10. SerpAPI — Lógica de Cache e Fallback

```typescript
// lib/serpapi/trends.ts
import { prisma } from "../../server/db";
import { getSegmentBySlug, type SegmentSlug } from "../segments";
import { getCityBySlug, type CitySlug }       from "../cities";

const TTL_MS = 12 * 60 * 60 * 1000; // 12 horas

interface FetchOptions {
  forceRefresh?: boolean;
}

export async function fetchSegmentTrends(
  segmentSlug: SegmentSlug,
  citySlug:    CitySlug,
  options:     FetchOptions = {}
) {
  // 1. Verifica cache (a menos que seja refresh forçado pelo Inngest)
  if (!options.forceRefresh) {
    const cached = await prisma.segmentTrendsCache.findUnique({
      where: {
        segmentSlug_citySlug_dataType: {
          segmentSlug,
          citySlug,
          dataType: "interest_over_time",
        },
      },
    });

    if (cached && cached.expiresAt > new Date()) {
      return { data: cached.payload, geoUsed: cached.geoUsed, fromCache: true };
    }
  }

  // 2. Busca na SerpAPI
  const segment = getSegmentBySlug(segmentSlug);
  const city    = getCityBySlug(citySlug);

  const data = await callSerpApi(segment.keywords, city.geoCode);

  // 3. Fallback para BR-PI se cidade não tiver dados suficientes
  const isEmpty  = !data?.interest_over_time?.timeline_data?.length;
  const geoFinal = isEmpty ? "BR-PI" : city.geoCode;
  const payload  = isEmpty
    ? await callSerpApi(segment.keywords, "BR-PI")
    : data;

  // 4. Salva no cache
  await prisma.segmentTrendsCache.upsert({
    where: {
      segmentSlug_citySlug_dataType: {
        segmentSlug,
        citySlug,
        dataType: "interest_over_time",
      },
    },
    update: {
      payload:   payload,
      geoUsed:   geoFinal,
      fetchedAt: new Date(),
      expiresAt: new Date(Date.now() + TTL_MS),
    },
    create: {
      segmentSlug,
      citySlug,
      dataType:  "interest_over_time",
      payload:   payload,
      geoUsed:   geoFinal,
      expiresAt: new Date(Date.now() + TTL_MS),
    },
  });

  return { data: payload, geoUsed: geoFinal, fromCache: false };
}

async function callSerpApi(keywords: readonly string[], geo: string) {
  const params = new URLSearchParams({
    engine:  "google_trends",
    q:       keywords.join(","),
    geo,
    date:    "today 3-m",
    hl:      "pt-BR",
    api_key: process.env.SERPAPI_KEY!,
  });

  const res = await fetch(`https://serpapi.com/search.json?${params}`);
  return res.json();
}
```

---

## 11. Variáveis de Ambiente

```bash
# Banco de dados (Neon DB)
DATABASE_URL=        # Connection string com pooler
DIRECT_URL=          # Direct URL para migrations

# Better Auth
BETTER_AUTH_SECRET=  # String aleatória 32+ caracteres
BETTER_AUTH_URL=     # URL base da aplicação

# APIs externas
SERPAPI_KEY=         # SerpAPI — plano Developer US$50/mês

# Inngest
INNGEST_EVENT_KEY=   # Chave do projeto no Inngest
INNGEST_SIGNING_KEY= # Chave de assinatura do webhook Inngest
```

---

## 12. Padrões de Código Obrigatórios

**Server functions para dados.** No TanStack Start, dados do servidor são buscados via `createServerFn` ou via oRPC. Nunca fazer fetch direto de APIs externas no cliente.

**Cache antes de qualquer chamada SerpAPI.** A função `fetchSegmentTrends` sempre verifica o banco antes de chamar a API. O Inngest é o único que usa `forceRefresh: true`.

**Constantes, nunca banco.** Segmento e cidade são lidos de `lib/segments.ts` e `lib/cities.ts`. Nunca de uma query Prisma.

**Fallback sempre registrado.** O campo `geoUsed` no cache registra se foi usado o geo code da cidade ou o fallback BR-PI. O frontend usa esse campo para exibir o aviso correto ao usuário.

**Linguagem:** Toda string visível ao usuário em português brasileiro. Zero jargão técnico em inglês na interface.

**Mobile-first.** Todos os componentes funcionam em viewport de 375px. O MEI usa smartphone.

**Cores semânticas do dashboard:**
- Verde `#16A34A` → crescimento, positivo
- Vermelho `#DC2626` → queda, alerta
- Cinza `#6B7280` → neutro
- Laranja `#EA580C` → atenção, oportunidade

---

## 13. Fases de Desenvolvimento

### Fase 1 — MVP (foco total)
- [ ] Setup TanStack Start + Vinxi + TanStack Router
- [ ] Better Auth com email/senha + Prisma + Neon DB
- [ ] Criar `lib/segments.ts` com constantes, tipos e helpers
- [ ] Criar `lib/cities.ts` com cidades do Piauí, geo codes e helpers
- [ ] Schema Prisma com migrations (User, Session, Account, Verification, SegmentTrendsCache)
- [ ] Onboarding: SegmentPicker + CityPicker → salva no User
- [ ] Procedure `trends.get()` com lógica de cache + fallback BR-PI
- [ ] Dashboard: gráfico de interesse ao longo do tempo
- [ ] Dashboard: queries relacionadas em alta
- [ ] Aviso de fallback quando `geoUsed === "BR-PI"`
- [ ] Setup Inngest: função de atualização de cache a cada 12h
- [ ] Endpoint `/api/inngest` registrado no TanStack Start

### Fase 2 — Expansão (pós-validação)
- [ ] Google OAuth → conectar conta Google Business Profile
- [ ] Dashboard individual: dados do perfil do MEI no Google
- [ ] Google Search Console: queries que trazem clientes ao site
- [ ] Insights via Claude API (Haiku) em linguagem natural

### Fase 3 — Premium
- [ ] Análise de concorrência via Google Maps Places
- [ ] Gate de plano (`user.plan === "PREMIUM"`)
- [ ] Fluxo de upgrade

---

## 14. Restrições e Alertas

**Não implementar Next.js.** O framework é TanStack Start. Não há `app/` directory no modelo Next.js, não há `page.tsx`, não há Route Handlers. As rotas seguem o padrão do TanStack Router com `createFileRoute`.

**Não usar Vercel Cron.** Jobs agendados são exclusivamente via Inngest.

**Não chamar SerpAPI por usuário.** O cache é por `segmentSlug + citySlug`. Qualquer implementação que chame SerpAPI fora do fluxo de cache ou do job Inngest está errada.

**Nunca criar model Segment ou City no Prisma.** São constantes em `lib/segments.ts` e `lib/cities.ts`. Se precisar dos dados, use os helpers — nunca uma query.

**Escopo geográfico fixo: Piauí.** Não há `state` como variável. O estado é sempre PI. A variável geográfica do usuário é `citySlug`, sempre uma das cidades de `lib/cities.ts`.

**LGPD:** A plataforma é "Operadora" de dados, o MEI é o "Controlador". Implementar endpoint de exclusão de conta que apague todos os dados do usuário.

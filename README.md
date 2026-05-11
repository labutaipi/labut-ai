# Labut AI

Plataforma de inteligência de mercado para MEIs do estado do Piauí. Exibe tendências de busca do Google Trends por segmento e cidade, com cache compartilhado e atualização automática a cada 12 horas.

---

## Stack

| Camada             | Tecnologia                                          |
| ------------------ | --------------------------------------------------- |
| Framework          | TanStack Start (SSR + Vite)                         |
| Autenticação       | Better Auth                                         |
| API interna        | oRPC (tipagem end-to-end)                           |
| ORM                | Prisma 7                                            |
| Banco de dados     | PostgreSQL via Docker (local) ou Neon DB (produção) |
| Connection pooling | PgBouncer (transaction mode — igual ao Neon)        |
| Tendências         | SerpAPI — Google Trends                             |
| Jobs agendados     | Inngest (cron a cada 12h)                           |
| Estilização        | Tailwind CSS v4                                     |
| Validação          | Zod                                                 |

---

## Configuração inicial

### 1. Instale as dependências

```bash
npm install
```

### 2. Configure as variáveis de ambiente

Copie o `.env.local` e preencha os valores:

```bash
# Banco de dados (Docker local — já configurado no docker-compose.yml)
DATABASE_URL="postgresql://postgres:postgres@localhost:6432/labut_ai"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/labut_ai"

# Better Auth
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=   # Gere com: npx @better-auth/cli secret

# SerpAPI
SERPAPI_KEY=          # plano Developer em serpapi.com

# Inngest (opcional para desenvolvimento local)
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=
```

### 3. Suba o banco de dados

```bash
npm run db:start
```

Isso inicia dois containers via Docker:

- **PostgreSQL** na porta `5432` — conexão direta (usada para migrations)
- **PgBouncer** na porta `6432` — connection pooling em transaction mode (usado pela aplicação)

### 4. Crie as tabelas

```bash
npm run db:push
```

### 5. Rode o servidor de desenvolvimento

```bash
npm run dev
```

Acesse em `http://localhost:3000`.

---

## Comandos do banco de dados

| Comando               | O que faz                                       |
| --------------------- | ----------------------------------------------- |
| `npm run db:start`    | Sobe PostgreSQL + PgBouncer via Docker          |
| `npm run db:stop`     | Para os containers                              |
| `npm run db:reset`    | Destrói e recria os containers (apaga os dados) |
| `npm run db:push`     | Aplica o schema Prisma no banco                 |
| `npm run db:migrate`  | Cria uma migration com nome                     |
| `npm run db:generate` | Regenera o Prisma Client                        |
| `npm run db:studio`   | Abre o Prisma Studio no browser                 |

---

## Estrutura de rotas

| Rota                | Descrição                                |
| ------------------- | ---------------------------------------- |
| `/`                 | Landing page                             |
| `/cadastro`         | Criar conta (email + senha)              |
| `/entrar`           | Login                                    |
| `/onboarding`       | Selecionar segmento e cidade (protegido) |
| `/dashboard`        | Painel de tendências (protegido)         |
| `/dashboard/perfil` | Perfil e configurações (protegido)       |
| `/api/auth/$`       | Handler do Better Auth                   |
| `/api/rpc/$`        | Handler do oRPC                          |
| `/api/inngest`      | Webhook do Inngest                       |

---

## Deploy (produção)

Em produção, substitua as URLs do Docker pelas URLs do **Neon DB**:

```bash
DATABASE_URL="postgresql://user:pass@ep-xxx.pooler.neon.tech:6432/neondb?sslmode=require"
DIRECT_URL="postgresql://user:pass@ep-xxx.neon.tech:5432/neondb?sslmode=require"
```

Build e start:

```bash
npm run build
node dist/server/index.mjs
```

---

## Outros comandos

```bash
npm run lint      # Biome lint
npm run format    # Biome format
npm run check     # Biome check (lint + format)
npm run test      # Vitest
```

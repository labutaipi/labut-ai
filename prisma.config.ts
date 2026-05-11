import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrations: {
    path: './prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // Conexão direta (sem PgBouncer) — necessária para migrations e shadow database
    url: env('DIRECT_URL'),
  },
})

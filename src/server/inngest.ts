import { Inngest } from 'inngest'
import { prisma } from '#/db'
import { fetchSegmentTrends } from '#/lib/serpapi/trends'

export const inngest = new Inngest({ id: 'mei-piaui' })

export const updateTrendsCache = inngest.createFunction(
  { id: 'update-trends-cache', triggers: [{ cron: '0 6,18 * * *' }] }, // 6h e 18h todos os dias
  async ({ step }) => {
    const activeCombos = await step.run('fetch-active-combos', async () => {
      return prisma.$queryRaw<{ segmentSlug: string; citySlug: string }[]>`
        SELECT DISTINCT u."segmentSlug", u."citySlug"
        FROM "User" u
        INNER JOIN "Session" s ON s."userId" = u.id
        WHERE s."expiresAt" > NOW()
          AND u."segmentSlug" IS NOT NULL
          AND u."citySlug"    IS NOT NULL
      `
    })

    await step.run('refresh-caches', async () => {
      for (const { segmentSlug, citySlug } of activeCombos) {
        await fetchSegmentTrends(segmentSlug as any, citySlug as any, { forceRefresh: true })
      }
    })

    return { updated: activeCombos.length }
  },
)

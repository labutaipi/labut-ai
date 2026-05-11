import * as z from 'zod'
import { protectedProcedure } from '#/server/orpc'
import { prisma } from '#/db'
import { isValidSegmentSlug } from '#/lib/segments'
import { isValidCitySlug } from '#/lib/cities'
import { fetchSegmentTrends } from '#/lib/serpapi/trends'

export const trendsRouter = {
  get: protectedProcedure
    .input(
      z.object({
        segmentSlug: z.string().refine(isValidSegmentSlug, 'Segmento inválido'),
        citySlug: z.string().refine(isValidCitySlug, 'Cidade inválida'),
      }),
    )
    .handler(async ({ input }) => {
      const result = await fetchSegmentTrends(
        input.segmentSlug as any,
        input.citySlug as any,
      )
      return result
    }),

  cacheInfo: protectedProcedure
    .input(
      z.object({
        segmentSlug: z.string(),
        citySlug: z.string(),
      }),
    )
    .handler(async ({ input }) => {
      const cached = await prisma.segmentTrendsCache.findUnique({
        where: {
          segmentSlug_citySlug_dataType: {
            segmentSlug: input.segmentSlug,
            citySlug: input.citySlug,
            dataType: 'interest_over_time',
          },
        },
        select: {
          fetchedAt: true,
          expiresAt: true,
          geoUsed: true,
        },
      })
      return cached
    }),
}

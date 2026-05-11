import { prisma } from '#/db'
import { getSegmentBySlug, type SegmentSlug } from '#/lib/segments'
import { getCityBySlug, type CitySlug } from '#/lib/cities'

const TTL_MS = 12 * 60 * 60 * 1000 // 12 horas

interface FetchOptions {
  forceRefresh?: boolean
}

export async function fetchSegmentTrends(
  segmentSlug: SegmentSlug,
  citySlug: CitySlug,
  options: FetchOptions = {},
) {
  // 1. Verifica cache (a menos que seja refresh forçado pelo Inngest)
  if (!options.forceRefresh) {
    const cached = await prisma.segmentTrendsCache.findUnique({
      where: {
        segmentSlug_citySlug_dataType: {
          segmentSlug,
          citySlug,
          dataType: 'interest_over_time',
        },
      },
    })

    if (cached && cached.expiresAt > new Date()) {
      return { data: cached.payload, geoUsed: cached.geoUsed, fromCache: true }
    }
  }

  // 2. Busca na SerpAPI
  const segment = getSegmentBySlug(segmentSlug)
  const city = getCityBySlug(citySlug)

  const data = await callSerpApi(segment.keywords, city.geoCode)

  // 3. Fallback para BR-PI se cidade não tiver dados suficientes
  const isEmpty = !(data as any)?.interest_over_time?.timeline_data?.length
  const geoFinal = isEmpty ? 'BR-PI' : city.geoCode
  const payload = isEmpty ? await callSerpApi(segment.keywords, 'BR-PI') : data

  // 4. Salva no cache
  await prisma.segmentTrendsCache.upsert({
    where: {
      segmentSlug_citySlug_dataType: {
        segmentSlug,
        citySlug,
        dataType: 'interest_over_time',
      },
    },
    update: {
      payload: payload as any,
      geoUsed: geoFinal,
      fetchedAt: new Date(),
      expiresAt: new Date(Date.now() + TTL_MS),
    },
    create: {
      segmentSlug,
      citySlug,
      dataType: 'interest_over_time',
      payload: payload as any,
      geoUsed: geoFinal,
      expiresAt: new Date(Date.now() + TTL_MS),
    },
  })

  return { data: payload, geoUsed: geoFinal, fromCache: false }
}

async function callSerpApi(keywords: readonly string[], geo: string) {
  const params = new URLSearchParams({
    engine: 'google_trends',
    q: keywords.join(','),
    geo,
    date: 'today 3-m',
    hl: 'pt-BR',
    api_key: process.env.SERPAPI_KEY!,
  })

  const res = await fetch(`https://serpapi.com/search.json?${params}`)
  return res.json()
}

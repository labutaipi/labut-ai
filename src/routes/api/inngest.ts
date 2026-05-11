import '#/polyfill'
import { createFileRoute } from '@tanstack/react-router'
import { serve } from 'inngest/edge'
import { inngest, updateTrendsCache } from '#/server/inngest'

const handler = serve({
  client: inngest,
  functions: [updateTrendsCache],
})

export const Route = createFileRoute('/api/inngest')({
  server: {
    handlers: {
      GET: ({ request }) => handler(request),
      POST: ({ request }) => handler(request),
      PUT: ({ request }) => handler(request),
    },
  },
})

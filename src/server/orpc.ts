import { os } from '@orpc/server'
import { auth } from '#/lib/auth'
import { prisma } from '#/db'

type AppContext = {
  request?: Request
  headers?: Record<string, string> | Headers
}

export const publicProcedure = os

export const protectedProcedure = os.use(async ({ context, next }) => {
  const ctx = context as AppContext
  const headers = ctx.request?.headers ?? new Headers(ctx.headers as HeadersInit)
  const session = await auth.api.getSession({ headers })
  if (!session) throw new Error('UNAUTHORIZED')
  return next({ context: { ...context, session, userId: session.user.id } })
})

export const premiumProcedure = protectedProcedure.use(async ({ context, next }) => {
  const ctx = context as AppContext & { userId: string }
  const user = await prisma.user.findUnique({ where: { id: ctx.userId } })
  if (user?.plan !== 'PREMIUM') throw new Error('UPGRADE_REQUIRED')
  return next({ context })
})

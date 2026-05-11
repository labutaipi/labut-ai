import * as z from 'zod'
import { protectedProcedure } from '#/server/orpc'
import { prisma } from '#/db'

export const userRouter = {
  me: protectedProcedure.input(z.object({})).handler(async ({ context }) => {
    const ctx = context as { userId: string }
    const user = await prisma.user.findUnique({
      where: { id: ctx.userId },
      select: {
        id: true,
        name: true,
        email: true,
        businessName: true,
        segmentSlug: true,
        citySlug: true,
        plan: true,
      },
    })
    if (!user) throw new Error('NOT_FOUND')
    return user
  }),

  update: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).optional(),
        businessName: z.string().min(2).optional(),
      }),
    )
    .handler(async ({ input, context }) => {
      const ctx = context as { userId: string }
      return prisma.user.update({
        where: { id: ctx.userId },
        data: input,
        select: {
          id: true,
          name: true,
          email: true,
          businessName: true,
          segmentSlug: true,
          citySlug: true,
          plan: true,
        },
      })
    }),

  deleteAccount: protectedProcedure.input(z.object({})).handler(async ({ context }) => {
    const ctx = context as { userId: string }
    await prisma.user.delete({ where: { id: ctx.userId } })
    return { success: true }
  }),
}

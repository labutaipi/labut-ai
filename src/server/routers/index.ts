import { os } from '@orpc/server'
import { trendsRouter } from './trends'
import { onboardingRouter } from './onboarding'
import { userRouter } from './user'

export const appRouter = os.router({
  trends: os.router(trendsRouter),
  onboarding: os.router(onboardingRouter),
  user: os.router(userRouter),
})

export type AppRouter = typeof appRouter

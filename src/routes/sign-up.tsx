import { createFileRoute } from '@tanstack/react-router'
import { SignupForm } from '#/features/auth/components/register'

export const Route = createFileRoute('/sign-up')({
  component: Cadastro,
})

function Cadastro() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </main>
  )
}


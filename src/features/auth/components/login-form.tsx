import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription
} from '@/components/ui/field' 
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { authClient } from "#/lib/auth-client"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

      const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  
const signInWithGoogle = async () => {
     await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    })

  }


      async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        setLoading(true)
    
        try {
          const result = await authClient.signIn.email({
            email: form.email,
            password: form.password,
          })
    
          if (result.error) {
            console.log('Error ao fazer login', result)
            return
          }
    setForm({
      email: '',
      password: '',
    })
          await navigate({ to: '/dashboard' })
        } catch(err) {
          console.error('Error ao entrar. Tente novamente:', err)
        } finally {
          setLoading(false)
        }
      }
    

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card  >
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Entre com seu email e senha para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Esqueci minha senha
                  </a>
                </div>
                <Input id="password" type="password" required />
              </Field>
              <Field>
                <Button disabled={loading} type="submit">Login</Button>
                <Button onClick={signInWithGoogle} disabled={loading} variant="outline" type="button">
                  Login com Google
                </Button>
                <FieldDescription className="text-center">
                  Não tem uma conta? <a href="#">Crie uma conta</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

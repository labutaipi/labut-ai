import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "#/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const signUpWithGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/onboarding",
      newUserCallbackURL: "/onboarding",
    });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      if (result.error) {
        toast.error(
          result.error.message ?? "Erro ao criar conta. Tente novamente.",
        );
        return;
      }

      await navigate({ to: "/onboarding" });
    } catch (err) {
      console.error("Erro ao criar conta:", err);
      toast.error("Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-6 bg-foreground/10 rounded-2xl",
        className,
      )}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle>Criar uma conta</CardTitle>
          <CardDescription>
            Insira suas informações abaixo para criar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Nome Completo</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Maria Silva"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
                <FieldDescription>
                  Nós usaremos este email para entrar em contato com você.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                />
                <FieldDescription>
                  Deve ter pelo menos 8 caracteres.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm-password">
                  Confirmar Senha
                </FieldLabel>
                <Input
                  id="confirm-password"
                  type="password"
                  required
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, confirmPassword: e.target.value }))
                  }
                />
                <FieldDescription>
                  Por favor, confirme sua senha.
                </FieldDescription>
              </Field>
              <Field>
                <Button disabled={loading} type="submit">
                  {loading ? "Criando conta..." : "Criar Conta"}
                </Button>
                <Button
                  onClick={signUpWithGoogle}
                  disabled={loading}
                  variant="outline"
                  type="button"
                >
                  Criar conta com o Google
                </Button>
                <FieldDescription className="text-center">
                  Já tem uma conta?{" "}
                  <Link
                    to="/sign-in"
                    className="no-underline hover:text-(--sea-ink)"
                  >
                    Entrar
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

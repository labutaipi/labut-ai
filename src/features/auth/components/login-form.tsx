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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
      newUserCallbackURL: "/onboarding",
    });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email: form.email,
        password: form.password,
      });

      if (result.error) {
        console.log("Error ao fazer login", result);
        toast.error("Credenciais inválidas.");
        return;
      }
      setForm({
        email: "",
        password: "",
      });
      await navigate({ to: "/dashboard" });
    } catch (err) {
      console.error("Error ao entrar. Tente novamente:", err);
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
                  <a className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Esqueci minha senha
                  </a>
                </div>
                <Input id="password" type="password" required />
              </Field>
              <Field>
                <Button disabled={loading} type="submit">
                  Login
                </Button>
                <Button
                  onClick={signInWithGoogle}
                  disabled={loading}
                  variant="outline"
                  type="button"
                >
                  Login com Google
                </Button>
                <FieldDescription className="text-center">
                  Não tem uma conta?{" "}
                  <Link
                    to="/sign-up"
                    className="no-underline hover:text-(--sea-ink)"
                  >
                    Crie uma conta
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

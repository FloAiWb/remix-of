"use client"

import { useState, useEffect, Suspense, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { authClient, useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader2, LogIn } from "lucide-react";

export const LoginContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending: sessionPending, refetch } = useSession();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!sessionPending && session?.user) {
      router.push("/");
    }
  }, [session, sessionPending, router]);

  // Show success message if just registered
  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      toast.success("Регистрация успешна! Войдите в свой аккаунт.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Заполните все поля");
      return;
    }

    setIsLoading(true);

    try {
      const redirectPath = searchParams.get("redirect") || "/";
      
      const { error } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
        callbackURL: redirectPath,
      });

      if (error?.code) {
        toast.error("Неверный email или пароль. Пожалуйста, убедитесь, что вы уже зарегистрировали аккаунт и попробуйте снова.");
        setIsLoading(false);
        return;
      }

      toast.success("Вход выполнен успешно!");
      // Ensure session state updates before redirect
      await refetch();
      router.push(redirectPath);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Произошла ошибка при входе");
      setIsLoading(false);
    }
  };

  if (sessionPending) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (session?.user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Вход</CardTitle>
          <CardDescription>
            Войдите в свой аккаунт для продолжения
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="off"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                disabled={isLoading}
              />
              <Label
                htmlFor="remember"
                className="text-sm font-normal cursor-pointer"
              >
                Запомнить меня
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Вход...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Войти
                </>
              )}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Нет аккаунта?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Зарегистрироваться
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

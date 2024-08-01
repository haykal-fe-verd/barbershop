"use client";

import React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { AuthError } from "next-auth";

import { login } from "@/actions/auth-actions";
import { loginSchema } from "@/lib/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import { DEFAULT_LOGIN_REDIRECT } from "@/data/routes";

function FormLogin() {
    // hooks
    const searchParams = useSearchParams();
    const router = useRouter();
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    // states
    const [isPending, startTransition] = React.useTransition();
    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    const [success, setSuccess] = React.useState<string | undefined>("");
    const [error, setError] = React.useState<string | undefined>("");
    const urlError =
        searchParams.get("error") === "OAuthAccountNotLinked" ? "Akun sudah terhubung dengan provider lain!" : "";

    // events
    const onSubmit = async (values: z.infer<typeof loginSchema>) => {
        setError("");
        setSuccess("");
        startTransition(async () => {
            const res = await login(values);
            if (res?.error) {
                setError(res.error);
            } else {
                setSuccess(res.message);
                router.push(DEFAULT_LOGIN_REDIRECT);
            }
        });
    };

    const onSocialLogin = async (provider: "github" | "google") => {
        setError("");
        setSuccess("");
        startTransition(() => {
            try {
                signIn(provider, { redirectTo: DEFAULT_LOGIN_REDIRECT });
                // eslint-disable-next-line @typescript-eslint/no-shadow
            } catch (error) {
                if (error instanceof AuthError) {
                    setError(error.cause?.err?.message);
                }
            }
        });
    };

    return (
        <Card className="max-w-md shadow-none">
            <CardContent>
                <div className="space-y-5">
                    <div className="flex flex-col items-center justify-center space-y-3 text-center">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <Icons.Logo className="h-20 w-20" />
                        </Link>
                        <h1 className="font-bold">Barbershop</h1>
                        <p className="text-sm">Selamat datang! Silahkan login untuk melanjutkan</p>
                    </div>

                    <div className="flex w-full gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="inline-flex w-full gap-2"
                            disabled={isPending}
                            onClick={() => onSocialLogin("github")}>
                            <Icons.Github className="h-5 w-5" />
                            <span className="font-bold">Github</span>
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="inline-flex w-full gap-2"
                            disabled={isPending}
                            onClick={() => onSocialLogin("google")}>
                            <Icons.Google className="h-4 w-4" />
                            <span className="font-bold">Google</span>
                        </Button>
                    </div>

                    <div className="flex items-center gap-5">
                        <Separator className="flex-1" />
                        <p className="text-sm">atau</p>
                        <Separator className="flex-1" />
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <fieldset disabled={isPending} className="space-y-5 text-left">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="example@mail.com"
                                                    autoComplete="email"
                                                    autoFocus
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="••••••••"
                                                        autoComplete="password"
                                                        {...field}
                                                    />
                                                    <button
                                                        type="button"
                                                        id="showPassword"
                                                        name="showPassword"
                                                        aria-label="showPassword"
                                                        className="absolute inset-y-0 right-0 flex items-center rounded-br-md rounded-tr-md p-3"
                                                        onClick={() => setShowPassword(!showPassword)}>
                                                        {showPassword ? (
                                                            <EyeOpenIcon className="h-4 w-4" />
                                                        ) : (
                                                            <EyeClosedIcon className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex flex-row-reverse items-center justify-between text-xs">
                                    <Link href="/forgot-password" className="hover:text-sky-500">
                                        Lupa password?
                                    </Link>
                                </div>

                                {/* return response error or success */}
                                <FormError message={error || urlError} />
                                <FormSuccess message={success} />

                                <Button type="submit" size="sm" className="inline-flex w-full items-center gap-2">
                                    {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                                    <span>Login</span>
                                </Button>
                            </fieldset>
                        </form>
                    </Form>

                    <p className="text-xs">
                        Belum punya akun?{" "}
                        <Link href="/register" className="text-sky-500">
                            Daftar sekarang
                        </Link>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

export default FormLogin;
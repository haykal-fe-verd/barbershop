"use client";

import React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { AuthError } from "next-auth";

import { register } from "@/actions/auth-actions";
import { registerSchema } from "@/lib/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import { DEFAULT_LOGIN_REDIRECT } from "@/data/routes";

function FormRegister() {
    // hooks
    const searchParams = useSearchParams();
    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            passwordConfirmation: "",
        },
    });

    // states
    const [isPending, startTransition] = React.useTransition();
    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = React.useState<boolean>(false);
    const [success, setSuccess] = React.useState<string | undefined>("");
    const [error, setError] = React.useState<string | undefined>("");
    const urlError =
        searchParams.get("error") === "OAuthAccountNotLinked" ? "Akun sudah terhubung dengan provider lain!" : "";

    // events
    const onSubmit = async (values: z.infer<typeof registerSchema>) => {
        setSuccess("");
        setError("");
        startTransition(async () => {
            const res = await register(values);
            if (res.error) {
                setError(res.error);
                form.reset();
            } else {
                setSuccess(res.message);
                form.reset();
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
                            <Icons.Logo className="h-20 w-20 dark:fill-white" />
                        </Link>
                        <h1 className="font-bold">Barbershop</h1>
                        <p className="text-sm">Selamat datang! Silahkan mendaftar untuk melanjutkan</p>
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
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nama</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="John Doe"
                                                    autoComplete="name"
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
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="example@mail.com"
                                                    autoComplete="email"
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

                                <FormField
                                    control={form.control}
                                    name="passwordConfirmation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Konfirmasi Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={showPasswordConfirmation ? "text" : "password"}
                                                        placeholder="••••••••"
                                                        {...field}
                                                    />
                                                    <button
                                                        type="button"
                                                        id="showPasswordConfirmation"
                                                        name="showPasswordConfirmation"
                                                        aria-label="showPasswordConfirmation"
                                                        className="absolute inset-y-0 right-0 flex items-center rounded-br-md rounded-tr-md p-3"
                                                        onClick={() =>
                                                            setShowPasswordConfirmation(!showPasswordConfirmation)
                                                        }>
                                                        {showPasswordConfirmation ? (
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

                                {/* return response error or success */}
                                <FormError message={error || urlError} />
                                <FormSuccess message={success} />

                                <Button type="submit" size="sm" className="inline-flex w-full items-center gap-2">
                                    {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                                    <span>Register</span>
                                </Button>
                            </fieldset>
                        </form>
                    </Form>

                    <p className="text-xs">
                        Sudah punya akun?{" "}
                        <Link href="/login" className="text-sky-500">
                            Login sekarang
                        </Link>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

export default FormRegister;

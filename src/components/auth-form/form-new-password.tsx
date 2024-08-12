"use client";

import React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { newPassword } from "@/actions/auth-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import { newPasswordSchema } from "@/lib/zod";

function FormNewPassword() {
    // hooks
    const searchParams = useSearchParams();
    const form = useForm<z.infer<typeof newPasswordSchema>>({
        resolver: zodResolver(newPasswordSchema),
        defaultValues: {
            password: "",
            passwordConfirmation: "",
        },
    });

    // states
    const token = searchParams.get("token");
    const [isPending, startTransition] = React.useTransition();
    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = React.useState<boolean>(false);
    const [success, setSuccess] = React.useState<string | undefined>("");
    const [error, setError] = React.useState<string | undefined>("");

    // events
    const onSubmit = async (values: z.infer<typeof newPasswordSchema>) => {
        setError("");
        setSuccess("");
        startTransition(async () => {
            const res = await newPassword(values, token as string);
            if (res?.error) {
                setError(res.error);
            } else {
                setSuccess(res.message);
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
                        <p className="text-sm">
                            Selamat datang! Silahkan masukkan password baru anda untuk melanjutkan
                        </p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <fieldset disabled={isPending} className="space-y-5 text-left">
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
                                <FormError message={error} />
                                <FormSuccess message={success} />

                                <Button type="submit" size="sm" className="inline-flex w-full items-center gap-2">
                                    {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                                    <span>Ganti Password</span>
                                </Button>
                            </fieldset>
                        </form>
                    </Form>

                    <p className="text-xs">
                        Berubah pikiran?{" "}
                        <Link href="/login" className="text-sky-500">
                            Login sekarang
                        </Link>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

export default FormNewPassword;

"use client";

import React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { forgotPassword } from "@/actions/auth-actions";
import { forgotPasswordSchema } from "@/lib/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";

function FormForgotPassword() {
    // hooks
    const form = useForm<z.infer<typeof forgotPasswordSchema>>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    // states
    const [isPending, startTransition] = React.useTransition();
    const [success, setSuccess] = React.useState<string | undefined>("");
    const [error, setError] = React.useState<string | undefined>("");

    // events
    const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
        setError("");
        setSuccess("");
        startTransition(async () => {
            const res = await forgotPassword(values);
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
                            Lupa password? Jangan khawatir, kami akan mengirimkan email untuk melakukan reset password
                            anda.
                        </p>
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

                                {/* return response error or success */}
                                <FormError message={error} />
                                <FormSuccess message={success} />

                                <Button type="submit" size="sm" className="inline-flex w-full items-center gap-2">
                                    {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                                    <span>Kirim reset link</span>
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

export default FormForgotPassword;

"use client";

import React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { newVerificationToken } from "@/actions/auth-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";

function FormNewVerification() {
    // hooks
    const searchParams = useSearchParams();
    const router = useRouter();

    // states
    const token = searchParams.get("token");
    const [success, setSuccess] = React.useState<string | undefined>("");
    const [error, setError] = React.useState<string | undefined>("");

    // events
    const onSubmit = React.useCallback(async () => {
        if (success || error) return;

        if (!token) {
            setError("Token tidak ditemukan");
            return;
        }

        const response = await newVerificationToken(token);
        if (response.error) {
            setError(response.error);
        } else {
            setSuccess(response.message);
        }
    }, [token, success, error]);

    // rendering
    React.useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    React.useEffect(() => {
        if (success) {
            const timeoutId = setTimeout(() => {
                router.push("/login");
            }, 1000);

            return () => clearTimeout(timeoutId);
        }
    }, [success, router]);

    return (
        <Card className="max-w-md shadow-none">
            <CardContent>
                <div className="space-y-5">
                    <div className="flex flex-col items-center justify-center space-y-3 text-center">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <Icons.Logo className="h-20 w-20 dark:fill-white" />
                        </Link>
                        <h1 className="font-bold">Barbershop</h1>
                        <p className="text-sm">Sedang mengonfirmasi email anda.</p>
                    </div>

                    <div className="flex items-center gap-5">
                        <Separator className="flex-1" />
                    </div>

                    {!error && !success && (
                        <div className="flex w-full items-center justify-center">
                            <Loader2 className="h-10 w-10 animate-spin" />
                        </div>
                    )}

                    {!success && <FormError message={error} />}
                    <FormSuccess message={success} />

                    <div className="flex items-center gap-5">
                        <Separator className="flex-1" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default FormNewVerification;

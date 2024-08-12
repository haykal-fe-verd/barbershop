import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import React from "react";

function Page() {
    return (
        <Card className="max-w-md shadow-none">
            <CardContent>
                <div className="space-y-5">
                    <div className="flex flex-col items-center justify-center space-y-3 text-center">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <Icons.Logo className="h-20 w-20 dark:fill-white" />
                        </Link>
                        <h1 className="font-bold">Barbershop</h1>
                        <p className="text-sm text-rose-500">Opps! Terjadi kesalahan tak terduga</p>
                    </div>

                    <Link
                        href="/login"
                        className={buttonVariants({ size: "default", className: "inline-flex items-center gap-2" })}>
                        <ArrowLeftIcon className="h-4 w-4" />
                        <span>Kembali ke halaman login</span>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

export default Page;

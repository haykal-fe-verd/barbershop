"use client";

import React from "react";
import Lottie from "lottie-react";
import { BadgeCheck } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import animationData from "@/public/lottie/success.json";

function PageSuccess() {
    return (
        <div className="flex min-h-[calc(100vh-121px)] w-full items-center justify-center">
            <div className="flex flex-col items-start justify-center leading-relaxed">
                <div className="flex w-full items-center justify-center">
                    <Lottie animationData={animationData} className="h-64 w-64" loop />
                </div>
                <h1 className="inline-flex items-center gap-2 text-4xl font-bold">
                    <span>Berhasil</span> <BadgeCheck className="text-sky-500" />
                </h1>
                <p className="text-muted-foreground">Transaksi berhasil dilakukan. silahkan menunggu nomor antrian!</p>
                <Link
                    href="/riwayat-transaksi"
                    className={buttonVariants({ size: "default", className: "mt-5 inline-flex items-center gap-2" })}>
                    Lihat transaksi saya
                </Link>
            </div>
        </div>
    );
}

export default PageSuccess;

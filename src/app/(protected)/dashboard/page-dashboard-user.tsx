"use client";

import React from "react";

import type { Paket } from "@prisma/client";

import CustomCard from "@/components/custom-card";
import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { currencyFormatter } from "@/lib/utils";
import { RocketIcon, Scissors } from "lucide-react";
import { useRouter } from "next/navigation";

function Skeleton() {
    return (
        <div className="flex h-full min-h-[6rem] w-full flex-1 rounded-xl border border-transparent bg-background bg-dot-black/[1] [mask-image:radial-gradient(ellipse_at_center,white,transparent)] dark:bg-dot-white/[1]" />
    );
}

interface PageDashboardUserProps {
    totalTransaksiSaya: number | null;
    antrianSekarang: any;
    paket: Paket[];
}

export default function PageDashboardUser({ totalTransaksiSaya, antrianSekarang, paket }: PageDashboardUserProps) {
    // hooks
    const router = useRouter();

    return (
        <div className="flex flex-col space-y-5">
            <div>
                <Header title="Dashboard" />
                <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground">
                    Cepat, bersih, nyaman & mudah.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:auto-rows-[20rem] md:grid-cols-3">
                <CustomCard
                    className="col-span-1 row-span-1 md:col-span-2"
                    title="Antrian Berjalan Sekarang"
                    header={<Skeleton />}
                    description={antrianSekarang?.noAntrian || "-"}
                />
                <CustomCard
                    className="col-span-1 row-span-1 md:col-span-1"
                    title="Total Transaksi Saya"
                    header={<Skeleton />}
                    description={totalTransaksiSaya || 0}
                />
            </div>

            <h1 className="text-2xl font-bold">Daftar Paket</h1>
            <Separator />
            <div className="grid grid-cols-1 gap-5 md:auto-rows-[20rem] md:grid-cols-3">
                {paket.map((item, i) => (
                    <CustomCard
                        key={i}
                        className="col-span-1 row-span-1 md:col-span-1"
                        header={<Skeleton />}
                        title={currencyFormatter(item.price)}
                        description={item.name}
                        icon={<Scissors className="h-4 w-4 text-slate-900" />}
                        iconButton={<RocketIcon className="h-4 w-4" />}
                        buttonText="Lihat Paket"
                        onClick={() => router.push("/booking")}
                    />
                ))}
            </div>
        </div>
    );
}

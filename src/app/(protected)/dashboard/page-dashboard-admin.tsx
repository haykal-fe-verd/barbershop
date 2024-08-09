"use client";

import React from "react";

import Header from "@/components/header";
import CustomCard from "@/components/custom-card";

function Skeleton() {
    return (
        <div className="flex h-full min-h-[6rem] w-full flex-1 rounded-xl border border-transparent bg-background bg-dot-black/[1] [mask-image:radial-gradient(ellipse_at_center,white,transparent)] dark:bg-dot-white/[1]" />
    );
}

interface PageDashboardAdminProps {
    antrianSekarang: any;
    totalTransaksi: number;
    totalAdmin: number;
    totalBarberman: number;
    totalPaket: number;
}
function PageDashboardAdmin({
    antrianSekarang,
    totalTransaksi,
    totalAdmin,
    totalBarberman,
    totalPaket,
}: PageDashboardAdminProps) {
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
                    title="Total Transaksi Hari Ini"
                    header={<Skeleton />}
                    description={totalTransaksi || 0}
                />
                <CustomCard
                    className="col-span-1 row-span-1 md:col-span-1"
                    title="Total Admin"
                    header={<Skeleton />}
                    description={totalAdmin || 0}
                />
                <CustomCard
                    className="col-span-1 row-span-1 md:col-span-1"
                    title="Total Barberman"
                    header={<Skeleton />}
                    description={totalBarberman || 0}
                />
                <CustomCard
                    className="col-span-1 row-span-1 md:col-span-1"
                    title="Total Paket"
                    header={<Skeleton />}
                    description={totalPaket || 0}
                />
            </div>
        </div>
    );
}

export default PageDashboardAdmin;

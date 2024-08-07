"use client";

import React from "react";
import type { Transaksi } from "@prisma/client";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { setAntrianActive, setAntrianInactive } from "@/actions/antrian-actions";
import { toast } from "sonner";
import { currencyFormatter } from "@/lib/utils";

type TransactionWithUserAndPaket = Transaksi & {
    user: {
        name: string | null;
    };
    paket: {
        name: string | null;
    };
};

interface PageAntrianProps {
    antrian: TransactionWithUserAndPaket[] | [];
}

function PageAntrian({ antrian }: PageAntrianProps) {
    // states
    const [activeAntrian, setActiveAntrian] = React.useState<string | null>(null);
    const [dataAntrian, setDataAntrian] = React.useState<TransactionWithUserAndPaket | null>(null);

    // events
    const findActiveAntrian = React.useMemo(() => antrian.find((item) => item.isActiveAntrian), [antrian]);

    const handleMulaiAntrian = async () => {
        const id = antrian[0].id ?? "";
        await setAntrianActive(id);
    };

    const handleNextAntrian = async () => {
        if (!dataAntrian) return;

        const currentIndex = antrian.findIndex((item) => item.id === dataAntrian.id);
        if (currentIndex === -1 || currentIndex === antrian.length - 1) return;

        const nextAntrian = antrian[currentIndex + 1];

        await setAntrianInactive(dataAntrian.id);
        await setAntrianActive(nextAntrian.id);

        toast("Antrian selanjutnya berhasil diaktifkan!");
    };

    const handlePreviousAntrian = async () => {
        if (!dataAntrian) return;

        const currentIndex = antrian.findIndex((item) => item.id === dataAntrian.id);
        if (currentIndex === -1 || currentIndex === 0) return;

        const previousAntrian = antrian[currentIndex - 1];

        await setAntrianInactive(dataAntrian.id);
        await setAntrianActive(previousAntrian.id);

        toast("Antrian sebelumnya berhasil diaktifkan!");
    };

    // mounted
    React.useEffect(() => {
        if (findActiveAntrian) {
            setActiveAntrian(findActiveAntrian.noAntrian);
            setDataAntrian(findActiveAntrian);
        }
    }, [findActiveAntrian]);

    return (
        <div className="flex flex-col space-y-5">
            <Header title="Antrian" />

            <Separator />

            <div className="grid grid-cols-1 gap-4 md:auto-rows-[20rem] md:grid-cols-3">
                <div className="col-span-3 row-span-1 flex flex-col gap-3 rounded-md border border-border bg-card p-5 text-card-foreground shadow-md md:col-span-2">
                    <h1 className="text-xl font-semibold">Antrian Sekarang</h1>
                    <Separator />
                    <div className="grid grid-cols-3 gap-5">
                        <div className="col-span-3 flex h-full items-center justify-center rounded-md border border-border p-3 shadow md:col-span-1">
                            <div className="text-7xl font-bold">{activeAntrian || "-"}</div>
                        </div>
                        <div className="col-span-3 p-3 md:col-span-2">
                            {activeAntrian ? (
                                <Table>
                                    <TableBody>
                                        <TableRow className="border-none">
                                            <TableCell className="w-[200px]">Nama</TableCell>
                                            <TableCell>: {dataAntrian?.user.name ?? "-"}</TableCell>
                                        </TableRow>
                                        <TableRow className="border-none">
                                            <TableCell className="w-[200px]">Paket</TableCell>
                                            <TableCell>: {dataAntrian?.paket.name ?? "-"}</TableCell>
                                        </TableRow>
                                        <TableRow className="border-none">
                                            <TableCell className="w-[200px]">Barberman</TableCell>
                                            <TableCell>: {dataAntrian?.namaBarberman ?? "-"}</TableCell>
                                        </TableRow>
                                        <TableRow className="border-none">
                                            <TableCell className="w-[200px]">Total</TableCell>
                                            <TableCell>: {currencyFormatter(dataAntrian?.total ?? 0)}</TableCell>
                                        </TableRow>
                                        <TableRow className="border-none">
                                            <TableCell className="w-[200px]">Via</TableCell>
                                            <TableCell>: {dataAntrian?.via ?? "-"}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            ) : (
                                "Belum ada antrian berjalan, silahkan klik tombol mulai antrian"
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-span-3 row-span-1 flex gap-3 rounded-md border border-border bg-card p-5 text-card-foreground shadow-md md:col-span-1 md:flex-col">
                    <div className="flex h-full w-full flex-col items-center justify-center gap-5 md:flex-row">
                        {activeAntrian ? (
                            <>
                                <Button
                                    disabled={
                                        antrian.length <= 0 ||
                                        (antrian[0].noAntrian === "001" && antrian[0].isActiveAntrian === true)
                                    }
                                    onClick={handlePreviousAntrian}
                                    className="inline-flex h-full w-full items-center justify-center gap-2">
                                    <ChevronLeft className="h-5 w-5" />
                                    <span>Antrian Sebelumnya</span>
                                </Button>
                                <Button
                                    onClick={handleNextAntrian}
                                    className="inline-flex h-full w-full items-center justify-center gap-2">
                                    <span>Antrian Selanjutnya</span>
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            </>
                        ) : (
                            <Button onClick={handleMulaiAntrian}>Mulai antrian</Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PageAntrian;

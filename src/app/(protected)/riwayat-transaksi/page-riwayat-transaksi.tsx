"use client";

import React from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

import type { Transaksi } from "@prisma/client";

import Header from "@/components/header";
import { cn, currencyFormatter } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import PerPage from "@/components/per-page";
import Search from "@/components/search";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Pagination from "@/components/pagination";

type TransactionWithUserAndPaket = Transaksi & {
    user: {
        name: string;
    };
    paket: {
        name: string;
    };
};

interface PageRiwayatTransaksiProps {
    totalPages: number;
    riwayatTransaksi: TransactionWithUserAndPaket[] | [];
}
function PageRiwayatTransaksi({ totalPages, riwayatTransaksi }: PageRiwayatTransaksiProps) {
    // table
    const columns = [
        { name: "#", className: "text-center w-10" },
        { name: "Tanggal", className: "text-left" },
        { name: "Invoice", className: "text-left" },
        { name: "Paket", className: "text-left" },
        { name: "Barberman", className: "text-left" },
        { name: "No Antrian", className: "text-left" },
        { name: "Via", className: "text-left" },
        { name: "Total", className: "text-left" },
        { name: "Status", className: "text-left" },
    ];

    return (
        <div className="flex flex-col space-y-5">
            <Header title="Transaksi" />

            <div className="flex flex-col space-y-5">
                <Separator />

                <div className="mb-5 flex flex-col items-start justify-between space-y-5 md:flex-row md:items-center md:space-y-0">
                    <PerPage />
                    <Search />
                </div>

                <div className="w-full overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-primary">
                                {columns.map((item, index) => (
                                    <TableHead key={index} className={cn(item.className, "text-primary-foreground")}>
                                        {item.name}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {riwayatTransaksi.length <= 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className={cn("p-4 text-center")}>
                                        Data Tidak Ditemukan
                                    </TableCell>
                                </TableRow>
                            ) : (
                                riwayatTransaksi.map((item, index) => (
                                    <TableRow key={item.id} className="odd:bg-white even:bg-muted">
                                        <TableCell className="text-center">{index + 1}</TableCell>
                                        <TableCell>{format(item.createdAt, "d MMMM y", { locale: id })}</TableCell>
                                        <TableCell>{item.invoice}</TableCell>
                                        <TableCell>{item?.paket?.name}</TableCell>
                                        <TableCell>{item.namaBarberman}</TableCell>
                                        <TableCell>{item.noAntrian}</TableCell>
                                        <TableCell>{item.via}</TableCell>
                                        <TableCell>
                                            {item.total !== null ? currencyFormatter(item.total) : "-"}
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={cn(
                                                    "rounded-md px-3 py-1 text-sm text-white",
                                                    item.status === "settlement" ? "bg-green-500" : "bg-red-500",
                                                )}>
                                                {item.status === "settlement" ? "Lunas" : "Belum Lunas"}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                <Pagination totalPage={totalPages} />
            </div>
        </div>
    );
}

export default PageRiwayatTransaksi;

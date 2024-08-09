import React from "react";

import type { Transaksi } from "@prisma/client";
import { getRiwayatTransaksi, getRiwayatTransaksiPages } from "@/actions/riwayat-transaksi";
import PageRiwayatTransaksi from "./page-riwayat-transaksi";

type TransactionWithUserAndPaket = Transaksi & {
    user: {
        name: string;
    };
    paket: {
        name: string;
    };
};

async function Page({
    searchParams,
}: {
    searchParams: {
        query?: string;
        take?: string;
        current_page?: string;
    };
}) {
    // states
    const query = searchParams?.query || "";
    const take = Number(searchParams?.take) || 8;
    const currentPage = Number(searchParams?.current_page) || 1;

    //  get data
    const totalPages = await getRiwayatTransaksiPages(query, take);
    const riwayatTransaksi = await getRiwayatTransaksi(query, take, currentPage);

    return (
        <PageRiwayatTransaksi
            totalPages={totalPages!}
            riwayatTransaksi={riwayatTransaksi as TransactionWithUserAndPaket[]}
        />
    );
}

export default Page;

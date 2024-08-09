import React from "react";

import type { Transaksi } from "@prisma/client";

import { getTransaksi, getTransaksiPages } from "@/actions/antrian-actions";
import PageTransaksi from "./page-transaksi";

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
    const totalPages = await getTransaksiPages(query, take);
    const transaksi = await getTransaksi(query, take, currentPage);

    return <PageTransaksi transaksi={transaksi as TransactionWithUserAndPaket[]} totalPages={totalPages} />;
}

export default Page;

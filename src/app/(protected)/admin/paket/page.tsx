import React from "react";

import { getPaket, getPaketPages } from "@/actions/paket-actions";
import PagePaket from "./page-paket";

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
    const totalPages = await getPaketPages(query, take);
    const paket = await getPaket(query, take, currentPage);

    return <PagePaket paket={paket} totalPages={totalPages} />;
}

export default Page;

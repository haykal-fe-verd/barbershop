import React from "react";

import { getBarberman, getBarbermanPages } from "@/actions/barberman-actions";
import PageBarberman from "./page-barberman";

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
    const totalPages = await getBarbermanPages(query, take);

    //  get data
    const barberman = await getBarberman(query, take, currentPage);

    return <PageBarberman barberman={barberman} totalPages={totalPages} />;
}

export default Page;

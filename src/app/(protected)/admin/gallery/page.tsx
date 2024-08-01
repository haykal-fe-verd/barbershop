import React from "react";

import { getGallery, getGalleryPages } from "@/actions/gallery-actions";
import PageGallery from "./page-gallery";

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
    const totalPages = await getGalleryPages(query, take);
    const galleries = await getGallery(query, take, currentPage);

    return <PageGallery galleries={galleries} totalPages={totalPages} />;
}

export default Page;

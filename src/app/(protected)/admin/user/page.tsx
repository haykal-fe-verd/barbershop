import React from "react";

import { getUsers, getUsersPages } from "@/actions/user-actions";
import PageUser from "./page-user";

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
    const totalPages = await getUsersPages(query, take);
    const users = await getUsers(query, take, currentPage);

    return <PageUser users={users} totalPages={totalPages} />;
}

export default Page;

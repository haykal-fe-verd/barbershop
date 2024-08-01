import React from "react";

import { getAllBarberman } from "@/actions/barberman-actions";
import PageBarberman from "./page-barberman";

async function Page() {
    const barberman = await getAllBarberman();

    return <PageBarberman barberman={barberman} />;
}

export default Page;

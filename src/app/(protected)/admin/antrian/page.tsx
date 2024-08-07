import React from "react";

import { getAllAntrianToday } from "@/actions/antrian-actions";
import PageAntrian from "./page-antrian";

async function Page() {
    const antrian = await getAllAntrianToday();
    return <PageAntrian antrian={antrian} />;
}

export default Page;

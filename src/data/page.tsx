import React from "react";

import { getAllPaket } from "@/actions/paket-actions";
import { getAllBarberman } from "@/actions/barberman-actions";
import { generateNoAntrian } from "@/lib/utils";
import PageBooking from "./page-booking";

async function Page() {
    const paket = await getAllPaket();
    const barberman = await getAllBarberman();
    const antrian = await generateNoAntrian();

    return <PageBooking paket={paket} barberman={barberman} antrian={antrian} />;
}

export default Page;

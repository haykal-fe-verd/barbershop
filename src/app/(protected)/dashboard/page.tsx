import React from "react";

import { auth } from "@/auth";
import {
    getAntrianBerjalanSekarang,
    getCountTransaksiSaya,
    getTigaPaket,
    getTotalAdmin,
    getTotalBarberman,
    getTotalPaket,
    getTotalTransaksi,
} from "@/actions/dashboard-actions";
import PageDashboardAdmin from "./page-dashboard-admin";
import PageDashboardUser from "./page-dashboard-user";

async function Page() {
    // hooks
    const session = await auth();
    const role = session?.user?.role;

    if (!session) {
        return null;
    }

    // get data
    const antrianSekarang = await getAntrianBerjalanSekarang();
    const totalTransaksi = await getTotalTransaksi();
    const totalAdmin = await getTotalAdmin();
    const totalBarberman = await getTotalBarberman();
    const totalPaket = await getTotalPaket();
    const totalTransaksiSaya = await getCountTransaksiSaya();
    const paket = await getTigaPaket();

    return role === "admin" ? (
        <PageDashboardAdmin
            antrianSekarang={antrianSekarang}
            totalTransaksi={totalTransaksi}
            totalAdmin={totalAdmin}
            totalBarberman={totalBarberman}
            totalPaket={totalPaket}
        />
    ) : (
        <PageDashboardUser totalTransaksiSaya={totalTransaksiSaya} antrianSekarang={antrianSekarang} paket={paket} />
    );
}

export default Page;

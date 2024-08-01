"use client";

import Header from "@/components/header";
import React from "react";

function PageLaporan() {
    return (
        <div className="flex flex-col space-y-5">
            <Header title="Laporan" />

            <div className="flex flex-col space-y-5">dari tanggal - sampai tanggal</div>
        </div>
    );
}

export default PageLaporan;

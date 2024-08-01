import { insertTransaction } from "@/actions/transaction-actions";
import Header from "@/components/header";
import { currencyFormatter } from "@/lib/utils";
import React from "react";

function Page() {
    const harga = 1500000;
    const hargaTerformat = currencyFormatter(harga);

    return (
        <div className="items-center justify-center">
            <Header title="Dashboard" />
            <div>Page dashboard</div>
            <div>{hargaTerformat}</div>
            <form action={insertTransaction}>
                <input type="text" />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default Page;

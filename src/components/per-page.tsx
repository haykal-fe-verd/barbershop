"use client";

import React from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function PerPage() {
    // hooks
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    // events
    const handlePerPageChange = (perPage: string) => {
        const params = new URLSearchParams(searchParams);

        if (perPage) {
            params.set("take", perPage);
        } else {
            params.delete("take");
        }
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex items-center">
            <span className="mr-2">Show</span>
            <Select
                name="perpage"
                onValueChange={handlePerPageChange}
                defaultValue={searchParams.get("take")?.toString()}>
                <SelectTrigger className="w-20">
                    <SelectValue placeholder={searchParams.get("take")?.toString() || "8"} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={String(8)}>8</SelectItem>
                    <SelectItem value={String(20)}>20</SelectItem>
                    <SelectItem value={String(50)}>50</SelectItem>
                </SelectContent>
            </Select>
            <span className="ml-2">Entries</span>
        </div>
    );
}

export default PerPage;

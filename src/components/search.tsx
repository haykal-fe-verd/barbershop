"use client";

import React from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

import { Input } from "@/components/ui/input";

function Search() {
    // hooks
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    // events
    const handleSeacrh = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("query", term);
        } else {
            params.delete("query");
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className="relative w-full rounded-md md:w-1/3">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center rounded-bl-md rounded-tl-md bg-primary p-3">
                <SearchIcon className="text-white dark:text-slate-900" />
            </div>
            <Input
                name="search"
                id="search"
                autoComplete="search"
                type="search"
                placeholder="Search something..."
                className="pl-14"
                onChange={(e) => handleSeacrh(e.target.value)}
                defaultValue={searchParams.get("query")?.toString()}
            />
        </div>
    );
}

export default Search;

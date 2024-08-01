/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/function-component-definition */

"use client";

import React from "react";
import Link from "next/link";

import { useSearchParams, usePathname } from "next/navigation";
import { cn, generatePagination } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({ totalPage }: { totalPage: number }) {
    // hooks
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const currentPage = Number(searchParams.get("current_page")) || 1;

    // events
    const createPageUrl = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set("current_page", pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    const allPages = generatePagination(currentPage, totalPage);

    const PaginationNumber = ({
        page,
        href,
        position,
        isActive,
    }: {
        page: number | string;
        href: string;
        position?: "first" | "last" | "middle" | "single";
        isActive: boolean;
    }) => {
        const className = cn("flex h-10 w-10 items-center justify-center text-sm border", {
            "rounded-l-md": position === "first" || position === "single",
            "rounded-r-md": position === "last" || position === "single",
            "z-10 bg-primary text-primary-foreground": isActive,
            "hover:bg-primary/10": !isActive && position !== "middle",
            "text-primary pointer-events-none": position === "middle",
        });

        return isActive && position === "middle" ? (
            <div className={className}>{page}</div>
        ) : (
            <Link href={href} className={className}>
                {page}
            </Link>
        );
    };

    const PaginationArrow = ({
        href,
        direction,
        isDisabled,
    }: {
        href: string;
        direction: "left" | "right";
        isDisabled?: boolean;
    }) => {
        const className = cn("flex h-10 w-10 items-center justify-center text-sm border rounded-md", {
            "pointer-events-none text-primary bg-primary/10": isDisabled,
            "hover:bg-primary/10": !isDisabled,
            "mr-2": direction === "left",
            "ml-2": direction === "right",
        });

        const icon = direction === "left" ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />;

        return isDisabled ? (
            <div className={className}>{icon}</div>
        ) : (
            <Link href={href} className={className}>
                {icon}
            </Link>
        );
    };

    return (
        <div className="mt-5 inline-flex">
            <PaginationArrow direction="left" href={createPageUrl(currentPage - 1)} isDisabled={currentPage <= 1} />

            <div className="flex -space-x-px">
                {allPages.map((page, index) => {
                    let position: "first" | "last" | "single" | "middle" | undefined;

                    if (index === 0) position = "first";
                    if (index === allPages.length - 1) position = "last";
                    if (allPages.length === 1) position = "single";
                    if (page === "...") position = "middle";

                    return (
                        <PaginationNumber
                            key={index}
                            href={createPageUrl(page)}
                            page={page}
                            position={position}
                            isActive={currentPage === page}
                        />
                    );
                })}
            </div>

            <PaginationArrow
                direction="right"
                href={createPageUrl(currentPage + 1)}
                isDisabled={currentPage >= totalPage}
            />
        </div>
    );
}

export default Pagination;

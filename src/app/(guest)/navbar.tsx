"use client";

import React from "react";
import Link from "next/link";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { guestNavigations } from "@/data/navigations";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";
import { ThemeColorToggle } from "@/components/theme-color-toggle";

function Navbar() {
    return (
        <div className="sticky inset-x-0 top-0 z-30 w-full bg-background shadow">
            <div className="container relative w-full">
                <div className="flex items-center justify-between">
                    <div className="flex w-full items-center gap-2">
                        <Icons.Logo className="h-8 w-auto dark:fill-white" />
                        <h1 className="text-xl font-bold">Barbershop</h1>
                    </div>
                    <nav className="flex w-full items-center justify-center">
                        <ul className="flex flex-row space-x-4 p-4">
                            {guestNavigations.map((item) => (
                                <Link href={item.href} key={item.name}>
                                    {item.name}
                                </Link>
                            ))}
                        </ul>
                    </nav>
                    <div className="flex w-full items-center justify-end gap-2">
                        <ThemeColorToggle />
                        <ThemeModeToggle />
                        <Button asChild size="sm">
                            <Link href="/login">Login</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;

"use client";

import React from "react";
import Link from "next/link";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";
import { ThemeColorToggle } from "@/components/theme-color-toggle";

function Navbar() {
    return (
        <div className="sticky inset-x-0 top-0 z-30 w-full bg-background shadow py-3">
            <div className="container relative w-full">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex w-full items-center gap-2 hover:cursor-pointer">
                        <Icons.Logo className="h-8 w-auto dark:fill-white" />
                        <h1 className="text-xl font-bold">Barbershop</h1>
                    </Link>
                    <nav className="md:flex w-full items-center justify-center p-4 hidden" />
                    <div className="md:flex w-full items-center justify-end gap-2 hidden">
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

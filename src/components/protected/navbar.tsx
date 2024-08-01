"use client";

import React from "react";

import { Icons } from "@/components/icons";
import ProtectedLayoutMainNav from "./protected-layout-main-nav";
import ProtectedLayoutDate from "./protected-layout-date";
import ProtectedLayoutUserNav from "./protected-layout-user-nav";

function Navbar() {
    return (
        <header className="border-b">
            <div className="flex h-16 items-center px-4">
                <div className="flex items-center gap-2">
                    <Icons.Logo className="h-8 w-auto" />
                    <h1 className="text-xl font-bold">Barbershop</h1>
                </div>
                <ProtectedLayoutMainNav className="mx-6" />
                <div className="ml-auto flex items-center space-x-4">
                    <ProtectedLayoutDate />
                    <ProtectedLayoutUserNav />
                </div>
            </div>
        </header>
    );
}

export default Navbar;

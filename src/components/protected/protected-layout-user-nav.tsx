"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getInitial } from "@/lib/utils";
import { protectedNavigations } from "@/data/navigations";

function ProtectedLayoutUserNav() {
    // hooks
    const { data: session } = useSession();
    const falbackAvatar = getInitial(session?.user?.name as string);
    const role = session?.user?.role;
    const pathname = usePathname();
    const router = useRouter();

    const filteredNavigations = protectedNavigations.filter((item) => {
        if (!item.roles || item.roles.length === 0) {
            return true;
        }
        return item.roles.includes(role!);
    });

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={session?.user?.image as string} alt={session?.user?.email as string} />
                        <AvatarFallback>{falbackAvatar}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{session?.user?.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuGroup className="block md:hidden">
                    {filteredNavigations.map((item, index) => (
                        <DropdownMenuItem
                            key={index}
                            onClick={() => router.push(item.href)}
                            className={cn("", pathname === item.href && "font-bold text-primary")}>
                            {item.name}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push("/profile")}>Profile</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default ProtectedLayoutUserNav;

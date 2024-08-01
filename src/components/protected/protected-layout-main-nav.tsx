// "use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { protectedNavigations } from "@/data/navigations";

interface ProtectedLayoutMainNavProps extends React.HTMLAttributes<HTMLElement> {
    className: string;
}

function ProtectedLayoutMainNav({ className, ...props }: ProtectedLayoutMainNavProps) {
    // hooks
    const { data: session } = useSession();
    const role = session?.user?.role;
    const pathname = usePathname();

    const filteredNavigations = protectedNavigations.filter((item) => {
        if (!item.roles || item.roles.length === 0) {
            return true;
        }
        return item.roles.includes(role!);
    });

    return (
        <nav className={cn("hidden items-center space-x-4 md:flex lg:space-x-6", className)} {...props}>
            {filteredNavigations.map((item, index) => (
                <Link
                    key={index}
                    href={item.href}
                    className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        pathname === item.href && "font-bold underline decoration-primary underline-offset-4",
                    )}>
                    {item.name}
                </Link>
            ))}
        </nav>
    );
}

export default ProtectedLayoutMainNav;

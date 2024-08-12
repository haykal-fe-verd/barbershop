import React from "react";
import { SessionProvider } from "next-auth/react";

import Navbar from "@/components/protected/navbar";
import { auth } from "@/auth";

interface ProtectedLayoutProps {
    children: React.ReactNode;
}

async function ProtectedLayout({ children }: Readonly<ProtectedLayoutProps>) {
    const session = await auth();

    if (session?.user) {
        session.user = {
            id: session.user.id as string,
            name: session.user.name as string,
            email: session.user.email as string,
            image: session.user.image as string,
            role: session.user.role as string,
        };
    }

    return (
        <SessionProvider session={session}>
            <Navbar />
            <div className="flex-1 space-y-4 p-8 pt-6">{children}</div>
        </SessionProvider>
    );
}

export default ProtectedLayout;

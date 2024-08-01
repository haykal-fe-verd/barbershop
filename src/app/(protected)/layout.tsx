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
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
            role: session.user.role,
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

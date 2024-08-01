"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";

interface SessionWrapperProps {
    children: React.ReactNode;
}
function SessionWrapper({ children }: SessionWrapperProps) {
    return <SessionProvider>{children}</SessionProvider>;
}

export default SessionWrapper;

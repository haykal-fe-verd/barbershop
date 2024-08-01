import React from "react";

interface AuthLayoutProps {
    children: React.ReactNode;
}

function AuthLayout({ children }: Readonly<AuthLayoutProps>) {
    return <div className="grid min-h-screen place-content-center p-5 text-center">{children}</div>;
}

export default AuthLayout;

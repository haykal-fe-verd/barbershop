import React from "react";

import { cn } from "@/lib/utils";

export interface MaxWidthWrapperProps {
    className?: string;
    children: React.ReactNode;
}
function MaxWidthWrapper({ className, children }: MaxWidthWrapperProps) {
    return <div className={cn("mx-auto w-full max-w-screen-2xl px-2.5 md:px-20", className)}>{children}</div>;
}

export default MaxWidthWrapper;

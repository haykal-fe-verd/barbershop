import React from "react";

import { cn } from "@/lib/utils";

interface ErrorValidationProps {
    message?: any;
}

function ErrorValidation({ message }: ErrorValidationProps) {
    return (
        <div className="mt-1" aria-live="polite" aria-atomic="true">
            <p className={cn("text-[0.8rem] font-medium text-destructive")}>{message}</p>
        </div>
    );
}

export default ErrorValidation;

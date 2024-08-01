"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="inline-flex items-center gap-2" disabled={pending}>
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>Simpan</span>
        </Button>
    );
}

export default SubmitButton;

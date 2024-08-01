import React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CustomCardProps {
    className?: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    header?: React.ReactNode;
    icon?: React.ReactNode;
    iconButton?: React.ReactNode;
    buttonText?: string | React.ReactNode;
    other?: React.ReactNode;
    onClick?: () => void;
}
function CustomCard({
    className,
    title,
    description,
    header,
    icon,
    iconButton,
    buttonText,
    other,
    onClick,
}: CustomCardProps) {
    return (
        <div
            className={cn(
                "group/bento row-span-1 flex flex-col justify-between space-y-4 overflow-hidden rounded-xl border border-border bg-white p-4 shadow-input transition duration-200 hover:shadow-xl dark:border-white/[0.2] dark:bg-black dark:shadow-none",
                className,
            )}>
            {header}
            <div className="transition duration-200 group-hover/bento:translate-x-2">
                {icon}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <div className="mb-2 mt-2 font-sans font-bold">{title}</div>
                        <div className="font-sans text-xs font-normal">{description}</div>
                    </div>
                    {other && other}
                    {buttonText && (
                        <Button size="sm" className="inline-flex items-center gap-2" onClick={onClick}>
                            {iconButton}
                            <span>{buttonText}</span>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CustomCard;

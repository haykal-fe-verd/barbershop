import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export function BentoGrid({ className, children }: { className?: string; children?: React.ReactNode }) {
    return (
        <div className={cn("mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3", className)}>
            {children}
        </div>
    );
}

export function BentoGridItem({
    className,
    title,
    description,
    header,
    icon,
    iconButton,
    buttonText,
    onClick,
}: {
    className?: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    header?: React.ReactNode;
    icon?: React.ReactNode;
    iconButton?: React.ReactNode;
    buttonText?: string | React.ReactNode;
    onClick?: () => void;
}) {
    return (
        <div
            className={cn(
                "group/bento row-span-1 flex flex-col justify-between space-y-4 rounded-xl border border-border bg-white p-4 shadow-input transition duration-200 hover:shadow-xl dark:border-white/[0.2] dark:bg-black dark:shadow-none",
                className,
            )}>
            {header}
            <div className="transition duration-200 group-hover/bento:translate-x-2">
                {icon}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <div className="mb-2 mt-2 font-sans font-bold text-neutral-600 dark:text-neutral-200">
                            {title}
                        </div>
                        <div className="font-sans text-xs font-normal text-neutral-600 dark:text-neutral-300">
                            {description}
                        </div>
                    </div>
                    <Button size="sm" className="inline-flex items-center gap-2" onClick={onClick}>
                        {iconButton}
                        <span>{buttonText}</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}

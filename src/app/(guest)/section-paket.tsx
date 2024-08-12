import { getAllPaket } from "@/actions/paket-actions";
import { buttonVariants } from "@/components/ui/button";
import { cn, currencyFormatter } from "@/lib/utils";
import { Bolt, Cloud, DollarSign, Eraser, Heart, HelpCircle, MoveLeft, Scissors, Terminal } from "lucide-react";
import Link from "next/link";

function Feature({
    title,
    description,
    icon,
    index,
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
    index: number;
}) {
    return (
        <div
            className={cn(
                "group/feature relative flex flex-col py-10 dark:border-neutral-800 lg:border-r",
                (index === 0 || index === 4) && "dark:border-neutral-800 lg:border-l",
                index < 4 && "dark:border-neutral-800 lg:border-b",
            )}>
            {index < 4 && (
                <div className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-t from-white to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100 dark:from-neutral-800" />
            )}
            {index >= 4 && (
                <div className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100 dark:from-neutral-800" />
            )}
            <div className="relative z-10 mb-4 px-10 text-neutral-600 dark:text-neutral-400">{icon}</div>
            <div className="relative z-10 mb-2 px-10 text-lg font-bold">
                <div className="absolute inset-y-0 left-0 h-6 w-1 origin-center rounded-br-full rounded-tr-full bg-neutral-300 transition-all duration-200 group-hover/feature:h-8 group-hover/feature:bg-blue-500 dark:bg-neutral-700" />
                <span className="inline-block text-neutral-800 transition duration-200 group-hover/feature:translate-x-2 dark:text-neutral-100">
                    {title}
                </span>
            </div>
            <p className="relative z-10 max-w-xs px-10 text-sm text-neutral-600 dark:text-neutral-300">{description}</p>
        </div>
    );
}

async function SectionPaket() {
    const paket = await getAllPaket();

    const paketArray = paket.map((item) => ({
        title: item.name,
        description: currencyFormatter(item.price),
        icon: <Scissors />,
    }));

    return (
        <section id="section-paket" className="w-full py-10 opacity-90">
            <div className="container">
                <h1>Paket</h1>
                <div className="relative z-10 grid grid-cols-1 py-10 md:grid-cols-2 lg:grid-cols-4">
                    {paketArray.map((item, index) => (
                        <Feature key={index} {...item} index={index} />
                    ))}
                </div>
                <div className="flex w-full items-center justify-center">
                    <Link href="/booking" className={buttonVariants({ size: "sm" })}>
                        Booking Sekarang
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default SectionPaket;

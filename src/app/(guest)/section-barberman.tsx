import React from "react";
import Image from "next/image";

import { getAllBarberman } from "@/actions/barberman-actions";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

async function SectionBarberman() {
    const barberman = await getAllBarberman();
    const limitedBarberman = barberman.slice(0, 4);

    return (
        <section id="section-barberman" className="w-full py-10 bg-background">
            <div className="container">
                <div className="w-full flex flex-col gap-10">
                    <div className="text-center leading-relaxed">
                        <h1 className="text-3xl font-bold text-primary">Barberman</h1>
                        <h2 className="text-sm">
                            Dapatkan barberman yang berpengalaman untuk membuat anda lebih keren
                        </h2>
                    </div>

                    <div className="grid grid-cols-4 gap-10 w-full">
                        {limitedBarberman.map((item, index) => (
                            <div key={index} className="col-span-4 md:col-span-1">
                                <div
                                    className={cn(
                                        "border border-border h-[300px] relative",
                                        item.status === "online"
                                            ? "border-b-4 border-b-green-500"
                                            : "border-b-4 border-b-red-500",
                                    )}>
                                    <div className="absolute inset-0 z-10 hover:bg-[radial-gradient(circle_at_top,transparent_20%,black_90%)]" />
                                    <Image
                                        src={item.image!}
                                        alt={item.name!}
                                        width={1000}
                                        height={1000}
                                        priority
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="mt-3">
                                    <h1 className="text-center font-bold">{item.name}</h1>
                                    <h3 className="text-sm text-muted-foreground text-center">{item.status}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <Separator className="mt-16" />
            </div>
        </section>
    );
}

export default SectionBarberman;

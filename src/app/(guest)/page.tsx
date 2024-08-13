import React from "react";
import Image from "next/image";

import InfiniteMoving from "@/components/aceternity/infinite-moving";
import Navbar from "./navbar";
import SectionHero from "./section-hero";
import Footer from "./footer";
import SectionMap from "./section-map";
import SectionPaket from "./section-paket";
import SectionBarberman from "./section-barberman";
import SectionGaleri from "./section-galeri";

async function Page() {
    const logos: { id: number; name: string; image: string }[] = [
        {
            id: 1,
            name: "Logo 1",
            image: "/images/logos/1.png",
        },
        {
            id: 2,
            name: "Logo 2",
            image: "/images/logos/2.png",
        },
        {
            id: 3,
            name: "Logo 3",
            image: "/images/logos/3.png",
        },
        {
            id: 4,
            name: "Logo 4",
            image: "/images/logos/4.png",
        },
        {
            id: 5,
            name: "Logo 5",
            image: "/images/logos/5.png",
        },
        {
            id: 6,
            name: "Logo 6",
            image: "/images/logos/6.png",
        },
        {
            id: 7,
            name: "Logo 7",
            image: "/images/logos/7.png",
        },
        {
            id: 8,
            name: "Logo 8",
            image: "/images/logos/8.png",
        },
        {
            id: 9,
            name: "Logo 9",
            image: "/images/logos/9.png",
        },
    ];
    return (
        <>
            <div className="pointer-events-none fixed z-10 flex min-h-screen w-screen justify-center px-6 py-40">
                <div className="bg-dot-thick absolute inset-0 opacity-25 bg-dot-thick-black/[0.5] dark:bg-dot-thick-white/[0.5]" />
                <Image
                    src="/images/mesh.svg"
                    alt="bg-mesh"
                    priority
                    width={1000}
                    height={1000}
                    className="absolute bottom-1 z-10 h-[600px] opacity-15"
                />
            </div>
            <div className="relative z-20">
                <Navbar />
                <SectionHero />
                <SectionPaket />
                <SectionBarberman />
                <SectionGaleri />
                <SectionMap />
                <div className="w-full bg-background antialiased items-center justify-center relative overflow-hidden">
                    <InfiniteMoving items={logos} direction="right" speed="fast" />
                </div>
                <Footer />
            </div>
        </>
    );
}

export default Page;

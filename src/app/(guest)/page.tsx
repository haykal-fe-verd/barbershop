import React from "react";
import Image from "next/image";

import Navbar from "./navbar";
import SectionHero from "./section-hero";
import Footer from "./footer";
import SectionMap from "./section-map";
import SectionPaket from "./section-paket";

async function Page() {
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
                <div className="container mx-auto">
                    <SectionHero />
                </div>
                <SectionPaket />
                <SectionMap />
                <Footer />
            </div>
        </>
    );
}

export default Page;

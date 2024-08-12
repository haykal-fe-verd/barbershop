import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import Image from "next/image";
import React from "react";

function SectionHero() {
    return (
        <section id="home" className="section-hero my-24 mt-32 flex flex-col text-center">
            <h1 className="text-4xl font-extrabold leading-relaxed sm:text-6xl">
                Barbershop
                <br />
                <span className="bg-gradient-to-r from-pink-500 via-indigo-600 to-pink-500 bg-clip-text text-transparent">
                    Nyaman, mudah dan cepat!
                </span>
            </h1>
            <h2 className="mt-5 text-xl text-muted-foreground">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti ut fugit hic veritatis, sit nobis
                aliquid et optio doloremque harum at impedit ducimus iusto rem fugiat nulla ipsum excepturi sapiente
                commodi. Hic reiciendis id dolorum suscipit.
            </h2>
            <div className="mx-auto mt-5 flex space-x-4">
                <Button className="inline-flex items-center justify-center gap-2 rounded-full">
                    <Rocket className="h-4 w-4" />
                    <span>Booking sekarang</span>
                </Button>
            </div>

            <div className="mt-5 w-full items-center justify-center">
                <Image
                    src="/images/hero.png"
                    width={1000}
                    height={1000}
                    alt="hero"
                    className="pointer-events-none mx-auto max-h-[300px] w-fit"
                />
            </div>
        </section>
    );
}

export default SectionHero;

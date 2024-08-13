import React from "react";
import Image from "next/image";
import { TypewriterEffectSmooth } from "@/components/aceternity/typewriter-effect";
import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect";
import { FlipWords } from "@/components/aceternity/flip-words";

function SectionHero() {
    const words = [
        {
            text: "Selamat",
        },
        {
            text: "datang",
        },
        {
            text: "di",
        },
        {
            text: "Barbershop.",
            className: "text-primary font-bold",
        },
    ];

    const kata = ["nyaman", "mudah", "aman", "cepat"];

    const text = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti ut fugit hic veritatis, sit nobis
                aliquid et optio doloremque harum at impedit ducimus iusto rem fugiat nulla ipsum excepturi sapiente
                commodi. Hic reiciendis id dolorum suscipit.`;

    return (
        <section id="home" className="container mx-auto my-24 mt-32 mb-24 flex flex-col text-center">
            <h1 className="text-4xl font-extrabold text-center leading-relaxed sm:text-6xl">
                <TypewriterEffectSmooth words={words} className="mt-32" />
                <br />

                <FlipWords words={kata} />
            </h1>
            <div className="mt-5 text-xl text-muted-foreground">
                <TextGenerateEffect words={text} />
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

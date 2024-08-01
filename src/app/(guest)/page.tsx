import { FlipWords } from "@/components/aceternity/flip-words";
import { HeroHighlight, Highlight } from "@/components/aceternity/hero-highlight";
import { TypewriterEffectSmooth } from "@/components/aceternity/typewriter-effect";
import { Button } from "@/components/ui/button";
import React from "react";

function Page() {
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
            text: "Barbershop",
            className: "text-blue-500 dark:text-blue-500",
        },
        {
            text: "kami.",
        },
    ];

    const flipWords = ["Undercut", "Pompadour", "Classy Haircut", "Slicked Back", "Buzz Cut"];

    return (
        <div className="container relative">
            <HeroHighlight>
                <TypewriterEffectSmooth words={words} />

                <div className="text-4xl font-normal text-neutral-600 dark:text-neutral-400">
                    <FlipWords words={flipWords} />
                </div>
                <Highlight className="text-black dark:text-white">copy, of a copy, of a copy.</Highlight>
                <Button>Explore Now</Button>
            </HeroHighlight>
        </div>
    );
}

export default Page;

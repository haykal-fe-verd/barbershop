/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";

export function TextGenerateEffect({
    words,
    className,
    filter = true,
    duration = 0.2,
}: {
    words: string;
    className?: string;
    filter?: boolean;
    duration?: number;
}) {
    const [scope, animate] = useAnimate();
    const wordsArray = words.split(" ");
    useEffect(() => {
        animate(
            "span",
            {
                opacity: 1,
                filter: filter ? "blur(0px)" : "none",
            },
            {
                duration: duration || 1,
                delay: stagger(0.2),
            },
        );
    }, [scope.current]);

    const renderWords = () => (
        <motion.div ref={scope}>
            {wordsArray.map((word, idx) => (
                <motion.span
                    key={word + idx}
                    className="text-muted-foreground opacity-0"
                    style={{
                        filter: filter ? "blur(10px)" : "none",
                    }}>
                    {word}{" "}
                </motion.span>
            ))}
        </motion.div>
    );

    return (
        <div className={cn("font-bold", className)}>
            <div className="mt-4">
                <div className="text-muted-foreground text-xl leading-snug tracking-wide">{renderWords()}</div>
            </div>
        </div>
    );
}

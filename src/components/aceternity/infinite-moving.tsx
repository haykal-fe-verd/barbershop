/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useState } from "react";

function InfiniteMoving({
    items,
    direction = "left",
    speed = "fast",
    pauseOnHover = true,
    className,
}: {
    items: {
        id: number;
        name: string;
        image: string;
    }[];
    direction?: "left" | "right";
    speed?: "fast" | "normal" | "slow";
    pauseOnHover?: boolean;
    className?: string;
}) {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const scrollerRef = React.useRef<HTMLDivElement>(null);
    const [start, setStart] = useState(false);

    const getDirection = () => {
        if (containerRef.current) {
            if (direction === "left") {
                containerRef.current.style.setProperty("--animation-direction", "forwards");
            } else {
                containerRef.current.style.setProperty("--animation-direction", "reverse");
            }
        }
    };
    const getSpeed = () => {
        if (containerRef.current) {
            if (speed === "fast") {
                containerRef.current.style.setProperty("--animation-duration", "20s");
            } else if (speed === "normal") {
                containerRef.current.style.setProperty("--animation-duration", "40s");
            } else {
                containerRef.current.style.setProperty("--animation-duration", "80s");
            }
        }
    };

    function addAnimation() {
        if (containerRef.current && scrollerRef.current) {
            const scrollerContent = Array.from(scrollerRef.current.children);

            scrollerContent.forEach((item) => {
                const duplicatedItem = item.cloneNode(true);
                if (scrollerRef.current) {
                    scrollerRef.current.appendChild(duplicatedItem);
                }
            });

            getDirection();
            getSpeed();
            setStart(true);
        }
    }

    useEffect(() => {
        addAnimation();
    }, []);

    return (
        <div ref={containerRef} className={cn("h-[200px] relative overflow-hidden mx-auto max-w-screen-xl", className)}>
            <div
                ref={scrollerRef}
                className={cn(
                    "flex",
                    start && "animate-scroll ",
                    pauseOnHover && "hover:[animation-play-state:paused]",
                )}>
                {items.map((item) => (
                    <div className="h-full flex-shrink-0" key={item.id}>
                        <div className="flex items-center justify-center h-[200px]">
                            <Image
                                src={item.image}
                                alt={item.name}
                                width={1000}
                                height={1000}
                                className="h-full w-fit opacity-75 object-contain"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default InfiniteMoving;

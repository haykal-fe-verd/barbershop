"use client";

import React from "react";
import type { Barberman } from "@prisma/client";
import CustomCard from "@/components/custom-card";
import { Component } from "lucide-react";
import Image from "next/image";

interface PageBarbermanProps {
    barberman: Barberman[];
}

function Skeleton({ href }: { href: string }) {
    return (
        <Image
            src={href}
            alt="skeleton"
            width={1000}
            height={1000}
            className="h-40 w-full rounded-md object-cover [mask-image:radial-gradient(ellipse_at_center,white,transparent)]"
        />
    );
}
function PageBarberman({ barberman }: PageBarbermanProps) {
    return (
        <div className="grid w-full grid-cols-12 gap-5">
            {barberman.length <= 0 ? (
                <div className="col-span-12">Paket tidak ditemukan...</div>
            ) : (
                barberman.map((item, i) => (
                    <CustomCard
                        key={i}
                        className="col-span-12 md:col-span-3"
                        title={item.status}
                        description={item.name}
                        header={<Skeleton href={item.image as string} />}
                        icon={<Component className="h-4 w-4 text-primary" />}
                    />
                ))
            )}
        </div>
    );
}

export default PageBarberman;

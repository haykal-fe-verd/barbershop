import React from "react";
import { getAllGallery } from "@/actions/gallery-actions";
import { Separator } from "@/components/ui/separator";
import { ParallaxScroll } from "@/components/aceternity/parallax-scroll";

async function SectionGaleri() {
    const galleries = await getAllGallery();
    // const imageUrls = galleries.map((gallery) => gallery.image);
    const imageUrls = galleries
        .map((gallery) => {
            const repeatedUrls = [];
            for (let i = 0; i < 3; i++) {
                repeatedUrls.push(gallery.image);
            }
            return repeatedUrls;
        })
        .flat();

    return (
        <section id="section-galeri" className="w-full py-10 bg-background">
            <div className="container">
                <div className="w-full flex flex-col gap-10">
                    <div className="text-center leading-relaxed">
                        <h1 className="text-3xl font-bold text-primary">Galeri</h1>
                        <h2 className="text-sm">Foto terbaru dari kami</h2>
                    </div>
                    <div className="w-full">
                        <ParallaxScroll images={imageUrls} />
                    </div>
                </div>
                <Separator className="mt-16" />
            </div>
        </section>
    );
}

export default SectionGaleri;

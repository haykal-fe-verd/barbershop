"use client";

import React from "react";

import type { Barberman, Paket } from "@prisma/client";
import { Dialog } from "@/components/ui/dialog";
import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";
import CustomCard from "@/components/custom-card";
import { currencyFormatter } from "@/lib/utils";
import { RocketIcon, Scissors } from "lucide-react";
import FormBooking from "./form-booking";

function Skeleton() {
    return (
        <div className="flex h-full min-h-[6rem] w-full flex-1 rounded-xl border border-transparent bg-background bg-dot-black/[1] [mask-image:radial-gradient(ellipse_at_center,white,transparent)] dark:bg-dot-white/[1]" />
    );
}

interface PageBookingProps {
    paket: Paket[];
    barberman: Barberman[];
    antrian: number | string | null;
}

function PageBooking({ paket, barberman, antrian }: PageBookingProps) {
    // states
    const [openModal, setOpenModal] = React.useState<boolean>(false);
    const [dataPaket, setDataPaket] = React.useState<Paket | null>(null);

    return (
        <Dialog
            open={openModal}
            onOpenChange={(isOpen) => {
                setOpenModal(isOpen);
                if (!isOpen) {
                    setDataPaket(null);
                }
            }}>
            <div className="flex flex-col space-y-5">
                <div>
                    <Header title="Booking" />
                    <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground">
                        Ayo booking sekarang supaya anda tidak lama menunggu dan dapatkan nomor antriannya.
                    </p>
                </div>

                <div className="flex flex-col space-y-5">
                    <Separator />
                </div>

                <div className="grid w-full grid-cols-12 gap-5">
                    {paket.length <= 0 ? (
                        <div className="col-span-12">Paket tidak ditemukan...</div>
                    ) : (
                        paket.map((item, i) => (
                            <CustomCard
                                key={i}
                                className="col-span-12 md:col-span-3"
                                title={currencyFormatter(item.price)}
                                description={item.name}
                                header={<Skeleton />}
                                icon={<Scissors className="h-4 w-4 text-slate-900" />}
                                iconButton={<RocketIcon className="h-4 w-4" />}
                                buttonText="Booking Sekarang"
                                onClick={() => {
                                    setOpenModal(true);
                                    setDataPaket(item);
                                }}
                            />
                        ))
                    )}
                </div>
            </div>

            {openModal && (
                <FormBooking
                    setOpenModal={setOpenModal}
                    barberman={barberman}
                    dataPaket={dataPaket!}
                    antrian={antrian}
                />
            )}
        </Dialog>
    );
}

export default PageBooking;

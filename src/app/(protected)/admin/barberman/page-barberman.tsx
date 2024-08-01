"use client";

import React from "react";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { Pencil, Trash2, VenetianMask } from "lucide-react";
import { toast } from "sonner";

import type { Barberman } from "@prisma/client";
import { cn } from "@/lib/utils";
import { deleteBarberman } from "@/actions/barberman-actions";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import PerPage from "@/components/per-page";
import Search from "@/components/search";
import Pagination from "@/components/pagination";
import CustomCard from "@/components/custom-card";
import FormBarberman from "./form-barberman";

function Skeleton({ href }: { href: string }) {
    return (
        <div className="flex h-full min-h-[6rem] w-full flex-1 rounded-xl border border-transparent bg-background">
            <Image
                src={href}
                alt="skeleton"
                width={1000}
                height={1000}
                className="h-60 w-full rounded-md border border-primary object-cover"
            />
        </div>
    );
}

interface PageBarbermanProps {
    barberman: Barberman[];
    totalPages: number;
}

function PageBarberman({ barberman, totalPages }: PageBarbermanProps) {
    // states
    const [openModal, setOpenModal] = React.useState<boolean>(false);
    const [isEditing, setIsEditing] = React.useState<boolean>(false);
    const [dataEdit, setDataEdit] = React.useState<Barberman | undefined>(undefined);

    // events
    const handleDelete = async (id: string) => {
        const res = await deleteBarberman(id);
        if (res.message !== null) {
            toast(res.message);
        }
    };

    const handleEdit = async (data: Barberman) => {
        setOpenModal(true);
        setIsEditing(true);
        setDataEdit(data);
    };

    return (
        <Dialog
            open={openModal}
            onOpenChange={(isOpen) => {
                setOpenModal(isOpen);
                if (!isOpen) {
                    setIsEditing(false);
                    setDataEdit(undefined);
                }
            }}>
            <div className="flex flex-col space-y-5">
                <Header title="Barberman" />

                <div className="flex flex-col space-y-5">
                    <Button onClick={() => setOpenModal(true)} className="inline-flex w-fit items-center gap-2">
                        <PlusCircledIcon className="h-4 w-4" />
                        <span>Tambah Barberman</span>
                    </Button>

                    <Separator />

                    <div className="mb-5 flex flex-col items-start justify-between space-y-5 md:flex-row md:items-center md:space-y-0">
                        <PerPage />
                        <Search />
                    </div>
                    <div className="grid w-full grid-cols-12 gap-5">
                        {barberman.length <= 0 ? (
                            <div className="col-span-12">Barberman tidak ditemukan...</div>
                        ) : (
                            barberman.map((item, i) => (
                                <CustomCard
                                    key={i}
                                    className="col-span-12 md:col-span-3"
                                    title={
                                        <span className="flex items-center gap-1">
                                            <div
                                                className={cn(
                                                    "h-3 w-3 rounded-full",
                                                    item.status === "online" ? "bg-green-500" : "bg-destructive",
                                                )}
                                            />
                                            {item.status}
                                        </span>
                                    }
                                    description={item.name}
                                    header={<Skeleton href={item.image as string} />}
                                    icon={<VenetianMask className="h-4 w-4 text-slate-900" />}
                                    other={
                                        <div className="flex gap-3">
                                            <Button size="icon" onClick={() => handleEdit(item)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button size="icon" onClick={() => handleDelete(item.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    }
                                />
                            ))
                        )}
                    </div>

                    <Pagination totalPage={totalPages} />
                </div>
            </div>

            {/* modal */}
            {openModal && <FormBarberman setOpenModal={setOpenModal} isEditing={isEditing} dataEdit={dataEdit} />}
        </Dialog>
    );
}

export default PageBarberman;

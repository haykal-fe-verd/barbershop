"use client";

import React from "react";
import { useFormState } from "react-dom";

import { insertBarberman, updateBarberman } from "@/actions/barberman-actions";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import ErrorValidation from "@/components/error-validation";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import SubmitButton from "@/components/submit-button";
import type { Barberman } from "@prisma/client";
import Image from "next/image";

interface FormBarbermanProps {
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
    isEditing: boolean;
    dataEdit?: Barberman;
}

function FormBarberman({ setOpenModal, isEditing, dataEdit }: FormBarbermanProps) {
    // states
    const actionState = isEditing ? updateBarberman.bind(null, dataEdit?.id!) : insertBarberman;
    const formRef = React.useRef<HTMLFormElement>(null);
    const [state, formAction] = useFormState(actionState, null);

    // mounted
    React.useEffect(() => {
        let mounted = true;
        if (mounted && state?.succes === true) {
            formRef.current?.reset();
            toast(state?.message);
            setOpenModal(false);
        }
        return () => {
            mounted = false;
        };
    }, [setOpenModal, state?.message, state?.succes]);

    return (
        <DialogContent className="max-w-2xl">
            <DialogHeader>
                <DialogTitle>{isEditing ? "Edit" : "Tambah"} Barberman</DialogTitle>
                <DialogDescription>
                    Form ini akan {isEditing ? "mengedit" : "menambahkan"} data barberman.
                </DialogDescription>
            </DialogHeader>

            <form action={formAction} ref={formRef} className="space-y-8">
                <div>
                    <Label htmlFor="name">Nama</Label>
                    <Input type="text" placeholder="Jhon Doe" name="name" defaultValue={dataEdit?.name} />
                    <ErrorValidation message={typeof state?.errors === "object" ? state?.errors?.name : undefined} />
                </div>

                <div>
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue={dataEdit?.status!}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="online">
                                <div className="inline-flex flex-row items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                    <span>Online</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="offline">
                                <div className="inline-flex flex-row items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-rose-500" />
                                    <span>Offline</span>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <ErrorValidation message={typeof state?.errors === "object" ? state?.errors?.status : undefined} />
                </div>

                <div>
                    <Label htmlFor="image">Foto</Label>
                    <Input type="file" name="image" />
                    {isEditing && (
                        <p className="ml-4 text-xs text-muted-foreground">Jika edit tidak perlu merubah foto</p>
                    )}
                    <ErrorValidation message={typeof state?.errors === "object" ? state?.errors?.image : undefined} />
                </div>

                {isEditing && dataEdit?.image && (
                    <Image
                        src={dataEdit?.image}
                        priority
                        alt="image"
                        width={300}
                        height={300}
                        className="h-28 w-28 place-content-center rounded-full border border-primary object-cover"
                    />
                )}

                <SubmitButton />
            </form>
        </DialogContent>
    );
}

export default FormBarberman;

"use client";

import React from "react";
import { useFormState } from "react-dom";

import type { Paket } from "@prisma/client";
import { insertPaket, updatePaket } from "@/actions/paket-actions";
import { toast } from "sonner";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import ErrorValidation from "@/components/error-validation";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/components/submit-button";

interface FormPaketProps {
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
    isEditing: boolean;
    dataEdit?: Paket;
}

function FormPaket({ setOpenModal, isEditing, dataEdit }: FormPaketProps) {
    // states
    const actionState = isEditing ? updatePaket.bind(null, dataEdit?.id!) : insertPaket;
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
                <DialogTitle>{isEditing ? "Edit" : "Tambah"} Paket Barber</DialogTitle>
                <DialogDescription>
                    Form ini akan {isEditing ? "mengedit" : "menambahkan"} data paket barber.
                </DialogDescription>
            </DialogHeader>

            <form action={formAction} ref={formRef} className="space-y-8">
                <div>
                    <Label htmlFor="name">Nama Paket</Label>
                    <Input type="text" name="name" placeholder="Masukkan Nama Paket" defaultValue={dataEdit?.name} />
                    <ErrorValidation message={typeof state?.errors === "object" ? state?.errors?.name : undefined} />
                </div>

                <div>
                    <Label htmlFor="price">Harga Paket</Label>
                    <div className="relative">
                        <Input
                            type="number"
                            name="price"
                            min={0}
                            placeholder="Masukkan Harga"
                            className="pl-12"
                            defaultValue={dataEdit?.price}
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center rounded-l-md bg-primary px-2 text-primary-foreground">
                            Rp.
                        </div>
                    </div>
                    <ErrorValidation message={typeof state?.errors === "object" ? state?.errors?.price : undefined} />
                </div>

                <SubmitButton />
            </form>
        </DialogContent>
    );
}

export default FormPaket;

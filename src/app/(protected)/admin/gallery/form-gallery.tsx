"use client";

import React from "react";
import { useFormState } from "react-dom";
import Image from "next/image";

import type { Gallery } from "@prisma/client";
import { insertGallery, updateGallery } from "@/actions/gallery-actions";
import { toast } from "sonner";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import ErrorValidation from "@/components/error-validation";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/components/submit-button";
import { Textarea } from "@/components/ui/textarea";

interface FormGalleryProps {
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
    isEditing: boolean;
    dataEdit?: Gallery;
}

function FormGallery({ setOpenModal, isEditing, dataEdit }: FormGalleryProps) {
    // states
    const actionState = isEditing ? updateGallery.bind(null, dataEdit?.id!) : insertGallery;
    const formRef = React.useRef<HTMLFormElement>(null);
    const [state, formAction] = useFormState(actionState, null);
    const [imagePreview, setImagePreview] = React.useState<string | null>(null);

    // events
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

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

    React.useEffect(() => {
        if (isEditing && dataEdit?.image) {
            setImagePreview(dataEdit.image);
        } else {
            setImagePreview(null);
        }
    }, [isEditing, dataEdit?.image]);

    return (
        <DialogContent className="max-w-2xl">
            <DialogHeader>
                <DialogTitle>{isEditing ? "Edit" : "Tambah"} Gallery Foto</DialogTitle>
                <DialogDescription>
                    Form ini akan {isEditing ? "mengedit" : "menambahkan"} data gallery foto.
                </DialogDescription>
            </DialogHeader>

            <form action={formAction} ref={formRef} className="space-y-8">
                <div>
                    <Label htmlFor="image">Foto</Label>
                    <Input type="file" name="image" onChange={handleImageChange} />
                    {isEditing && (
                        <p className="ml-4 text-xs text-muted-foreground">Jika edit tidak perlu merubah foto</p>
                    )}
                    <ErrorValidation message={typeof state?.errors === "object" ? state?.errors?.image : undefined} />
                </div>

                <div>
                    <Label htmlFor="description">Deskripsi Gambar</Label>
                    <Textarea placeholder="Deskripsi gambar" name="description" defaultValue={dataEdit?.description!} />
                    <ErrorValidation
                        message={typeof state?.errors === "object" ? state?.errors?.description : undefined}
                    />
                </div>

                {imagePreview && (
                    <Image
                        src={imagePreview}
                        priority
                        alt="image"
                        width={300}
                        height={300}
                        className="h-full w-full place-content-center border border-primary object-cover"
                    />
                )}

                <SubmitButton />
            </form>
        </DialogContent>
    );
}

export default FormGallery;

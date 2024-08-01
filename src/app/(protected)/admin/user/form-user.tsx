"use client";

import React from "react";
import { useFormState } from "react-dom";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import Image from "next/image";

import type { User } from "@prisma/client";
import { insertUser, updateUser } from "@/actions/user-actions";
import { toast } from "sonner";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import ErrorValidation from "@/components/error-validation";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/components/submit-button";
import FormError from "@/components/form-error";

interface FormUserProps {
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
    isEditing: boolean;
    dataEdit?: Omit<User, "password" | "emailVerified">;
}

function FormUser({ setOpenModal, isEditing, dataEdit }: FormUserProps) {
    // states
    const actionState = isEditing ? updateUser.bind(null, dataEdit?.id!) : insertUser;
    const formRef = React.useRef<HTMLFormElement>(null);
    const [state, formAction] = useFormState(actionState, null);
    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = React.useState<boolean>(false);
    const [imagePreview, setImagePreview] = React.useState<string | null>(null);
    const [error, setError] = React.useState<any>(null);

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

        if (mounted && state?.errors) {
            if (typeof state.errors === "string") {
                setError(state?.errors);
            }
        }
        return () => {
            mounted = false;
        };
    }, [setOpenModal, state?.errors, state?.message, state?.succes]);

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
                <DialogTitle>{isEditing ? "Edit" : "Tambah"} User Admin</DialogTitle>
                <DialogDescription>
                    Form ini akan {isEditing ? "mengedit" : "menambahkan"} data user admin.
                </DialogDescription>
            </DialogHeader>

            <form action={formAction} ref={formRef} className="space-y-8">
                {error && <FormError message={error} />}
                <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-12 md:col-span-6">
                        <Label htmlFor="name">Nama</Label>
                        <Input type="text" name="name" placeholder="Jhon Doe" defaultValue={dataEdit?.name!} />
                        <ErrorValidation
                            message={typeof state?.errors === "object" ? state?.errors?.name : undefined}
                        />
                    </div>

                    <div className="col-span-12 md:col-span-6">
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" name="email" placeholder="jhon@doe.com" defaultValue={dataEdit?.email!} />
                        <ErrorValidation
                            message={typeof state?.errors === "object" ? state?.errors?.email : undefined}
                        />
                    </div>

                    <div className="col-span-12 md:col-span-6">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="••••••••"
                                autoComplete="password"
                            />
                            <button
                                type="button"
                                id="showPassword"
                                name="showPassword"
                                aria-label="showPassword"
                                className="absolute inset-y-0 right-0 flex items-center rounded-r-md p-3"
                                onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? (
                                    <EyeOpenIcon className="h-4 w-4" />
                                ) : (
                                    <EyeClosedIcon className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        <ErrorValidation
                            message={typeof state?.errors === "object" ? state?.errors?.password : undefined}
                        />
                    </div>

                    <div className="col-span-12 md:col-span-6">
                        <Label htmlFor="passwordConfirmation">Konfirmasi Password</Label>
                        <div className="relative">
                            <Input
                                type={showPasswordConfirmation ? "text" : "password"}
                                placeholder="••••••••"
                                name="passwordConfirmation"
                            />
                            <button
                                type="button"
                                id="showPasswordConfirmation"
                                name="showPasswordConfirmation"
                                aria-label="showPasswordConfirmation"
                                className="absolute inset-y-0 right-0 flex items-center rounded-br-md rounded-tr-md p-3"
                                onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}>
                                {showPasswordConfirmation ? (
                                    <EyeOpenIcon className="h-4 w-4" />
                                ) : (
                                    <EyeClosedIcon className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        <ErrorValidation
                            message={
                                typeof state?.errors === "object" ? state?.errors?.passwordConfirmation : undefined
                            }
                        />
                    </div>

                    <div className="col-span-12 md:col-span-6">
                        <Label htmlFor="role">Role</Label>
                        <Input type="text" name="role" placeholder="Admin" defaultValue="admin" readOnly />
                        <ErrorValidation
                            message={typeof state?.errors === "object" ? state?.errors?.role : undefined}
                        />
                    </div>

                    <div className="col-span-12 md:col-span-6">
                        <Label htmlFor="phone">HP</Label>
                        <Input type="text" name="phone" placeholder="0823-xxxx-xxxx" defaultValue={dataEdit?.phone!} />
                        <ErrorValidation
                            message={typeof state?.errors === "object" ? state?.errors?.phone : undefined}
                        />
                    </div>

                    <div className="col-span-12">
                        <Label htmlFor="image">Foto</Label>
                        <Input type="file" name="image" onChange={handleImageChange} />
                        <ErrorValidation
                            message={typeof state?.errors === "object" ? state?.errors?.image : undefined}
                        />
                    </div>

                    {imagePreview && (
                        <div className="col-span-12 flex items-center justify-center">
                            <Image
                                src={imagePreview}
                                priority
                                alt="image"
                                width={1000}
                                height={1000}
                                className="h-20 w-20 place-content-center items-center rounded-full border border-primary object-cover"
                            />
                        </div>
                    )}
                </div>

                <SubmitButton />
            </form>
        </DialogContent>
    );
}

export default FormUser;

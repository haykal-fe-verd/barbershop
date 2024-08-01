/* eslint-disable jsx-a11y/control-has-associated-label */

"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useFormState } from "react-dom";
import { CameraIcon, EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { nanoid } from "nanoid";

import { toast } from "sonner";
import { updateProfile } from "@/actions/auth-actions";
import Header from "@/components/header";
import SubmitButton from "@/components/submit-button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ErrorValidation from "@/components/error-validation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BadgeCheck } from "lucide-react";
import { cn, getInitial } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface PageProfileProps {
    account: any | null;
}

function PageProfile({ account }: PageProfileProps) {
    // hooks
    const { data: session, update } = useSession();
    const user = session?.user;

    // states
    const falbackAvatar = getInitial(session?.user?.name as string);
    const imageRef = React.useRef<HTMLInputElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [formKey, setFormKey] = React.useState(() => nanoid());
    const formRef = React.useRef<HTMLFormElement>(null);
    const [state, formAction] = useFormState(updateProfile.bind(null, user?.id!), null);
    const [imagePreview, setImagePreview] = React.useState<string | null>(null);
    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = React.useState<boolean>(false);

    // events
    const updateFormKey = () => setFormKey(nanoid());

    const browse = () => {
        imageRef.current?.click();
    };

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
        if (mounted && state?.succes === true && state?.data) {
            toast(state?.message);
            update({ name: state?.data?.name, image: state?.data?.image, phone: state?.data?.phone });
        }
        return () => {
            mounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state?.data, state?.message, state?.succes]);

    React.useEffect(() => {
        if (user?.image) {
            setImagePreview(user.image);
        } else {
            setImagePreview(null);
        }
    }, [user?.image]);

    if (!user) return null;

    return (
        <div className="flex flex-col space-y-5">
            <Header title="My Profile" />

            <form action={formAction} ref={formRef} onReset={updateFormKey} className="space-y-8">
                <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-12 flex flex-col gap-3 rounded-md border p-4 md:col-span-4">
                        <div className="relative h-[200px] w-full rounded-md bg-gradient-to-t from-primary to-secondary">
                            <button
                                type="button"
                                onClick={browse}
                                className={cn(
                                    "absolute -bottom-10 left-[50%] z-20 flex h-20 w-20 -translate-x-[50%] items-center justify-center rounded-full bg-black text-white opacity-0 hover:opacity-80",
                                    account && "hidden",
                                )}>
                                <CameraIcon />
                            </button>
                            <input
                                id="image"
                                name="image"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={imageRef}
                                onChange={handleImageChange}
                            />
                            <Avatar className="absolute -bottom-10 left-[50%] h-20 w-20 -translate-x-[50%] border">
                                <AvatarImage src={imagePreview!} alt={user?.email as string} />
                                <AvatarFallback>{falbackAvatar}</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="mt-10 text-sm leading-relaxed">
                            <ErrorValidation
                                message={typeof state?.errors === "object" ? state?.errors?.image : undefined}
                            />
                            <p className="font-semibold">{user?.name}</p>
                            <p>{user?.email}</p>
                            <p>{user?.phone}</p>
                            {!account && <Badge variant="secondary">Email</Badge>}
                            {account && account?.provider === "google" && <Badge variant="success">Google</Badge>}
                            {account && account?.provider === "github" && <Badge variant="default">Github</Badge>}
                        </div>
                    </div>
                    <div className="col-span-12 grid grid-cols-12 gap-3 rounded-md border p-4 md:col-span-8">
                        <div className="col-span-12 md:col-span-6">
                            <Label htmlFor="name">Nama</Label>
                            <Input type="text" placeholder="Jhon Doe" name="name" defaultValue={user?.name!} />
                            <ErrorValidation
                                message={typeof state?.errors === "object" ? state?.errors?.name : undefined}
                            />
                        </div>

                        <div className="col-span-12 md:col-span-6">
                            <Label htmlFor="email" className="inline-flex items-center gap-2">
                                Email
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <BadgeCheck className="h-4 w-4 text-sky-500" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Email terverifikasi</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </Label>
                            <Input
                                type="email"
                                placeholder="jhon@doe.com"
                                name="email"
                                defaultValue={user?.email!}
                                readOnly
                            />
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
                                    readOnly={account}
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
                                    readOnly={account}
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
                            <Label htmlFor="phone">No HP</Label>
                            <Input type="text" placeholder="08XXXXXXXXX" name="phone" defaultValue={user?.phone!} />
                            <ErrorValidation
                                message={typeof state?.errors === "object" ? state?.errors?.phone : undefined}
                            />
                        </div>

                        <div className="col-span-12">
                            <SubmitButton />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default PageProfile;

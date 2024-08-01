"use client";

import React from "react";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import type { User } from "@prisma/client";

import { deleteUser } from "@/actions/user-actions";
import { toast } from "sonner";
import { cn, getInitial } from "@/lib/utils";
import Header from "@/components/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PerPage from "@/components/per-page";
import Search from "@/components/search";
import Pagination from "@/components/pagination";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FormUser from "./form-user";

interface PageUserProps {
    users: Omit<User, "password" | "emailVerified">[];
    totalPages: number;
}

function PageUser({ users, totalPages }: PageUserProps) {
    // states
    const [openModal, setOpenModal] = React.useState<boolean>(false);
    const [isEditing, setIsEditing] = React.useState<boolean>(false);
    const [dataEdit, setDataEdit] = React.useState<Omit<User, "password" | "emailVerified"> | undefined>(undefined);

    // events
    const handleEdit = async (data: Omit<User, "password" | "emailVerified">) => {
        setOpenModal(true);
        setIsEditing(true);
        setDataEdit(data);
    };

    const handleDelete = async (id: string) => {
        const res = await deleteUser(id);
        if (res.message !== null) {
            toast(res.message);
        }
    };

    // table
    const header = [
        { name: "#", className: "text-center w-10" },
        { name: "Nama", className: "text-left" },
        { name: "Email", className: "text-left" },
        { name: "No HP", className: "text-left" },
        { name: "Role", className: "text-left" },
        { name: "Foto", className: "text-left" },
        { name: "@", className: "text-center w-20" },
    ];

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
                <Header title="Users" />

                <div className="flex flex-col space-y-5">
                    <Button onClick={() => setOpenModal(true)} className="inline-flex w-fit items-center gap-2">
                        <PlusCircledIcon className="h-4 w-4" />
                        <span>Tambah User Admin</span>
                    </Button>
                    <Separator />
                    <div className="mb-5 flex flex-col items-start justify-between space-y-5 md:flex-row md:items-center md:space-y-0">
                        <PerPage />
                        <Search />
                    </div>

                    <div className="w-full overflow-hidden rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-primary">
                                    {header.map((item, index) => (
                                        <TableHead
                                            key={index}
                                            className={cn(item.className, "text-primary-foreground")}>
                                            {item.name}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.length <= 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={header.length} className={cn("p-4 text-center")}>
                                            Data Tidak Ditemukan
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.map((item, index) => {
                                        const falbackAvatar = getInitial(item.name as string);
                                        return (
                                            <TableRow key={item.id} className="odd:bg-white even:bg-muted">
                                                <TableCell className="text-center">{index + 1}</TableCell>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>{item.email}</TableCell>
                                                <TableCell>{item.phone ?? "-"}</TableCell>
                                                <TableCell>
                                                    <span
                                                        className={cn(
                                                            "rounded-md px-2 py-1 text-xs text-white",
                                                            item.role === "admin" ? "bg-amber-500" : "bg-sky-500",
                                                        )}>
                                                        {item.role}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <Avatar className="h-8 w-8 border">
                                                        <AvatarImage
                                                            src={item?.image as string}
                                                            alt={item?.name as string}
                                                        />
                                                        <AvatarFallback>{falbackAvatar}</AvatarFallback>
                                                    </Avatar>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {item.role === "admin" ? (
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="z-50 h-8 w-8 p-0">
                                                                    <span className="sr-only">Open menu</span>
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem
                                                                    className="items-center gap-3"
                                                                    onClick={() => handleEdit(item)}>
                                                                    <Pencil className="h-4 w-4" />
                                                                    <span>Edit</span>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    className="items-center gap-3"
                                                                    onClick={() => handleDelete(item.id)}>
                                                                    <Trash2 className="h-4 w-4" />
                                                                    <span>Hapus</span>
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    ) : null}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <Pagination totalPage={totalPages} />
                </div>
            </div>

            {/* modal */}
            {openModal && <FormUser setOpenModal={setOpenModal} isEditing={isEditing} dataEdit={dataEdit} />}
        </Dialog>
    );
}

export default PageUser;

"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { updateStatusTransaksiSchema } from "@/lib/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateTransaksiStatus } from "@/actions/antrian-actions";
import { toast } from "sonner";

interface FormUpdateStatusProps {
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
    id: string;
    status: string;
}
function FormUpdateStatus({ setOpenModal, id, status }: FormUpdateStatusProps) {
    // hooks
    const form = useForm<z.infer<typeof updateStatusTransaksiSchema>>({
        resolver: zodResolver(updateStatusTransaksiSchema),
        defaultValues: {
            id,
            status,
        },
    });

    // events
    const onSubmit = async (values: z.infer<typeof updateStatusTransaksiSchema>) => {
        const response = await updateTransaksiStatus(values.id, values.status);
        if (response.message) {
            toast("Status transaksi berhasil diubah!");
            setOpenModal(false);
        }
    };

    return (
        <DialogContent className="max-w-2xl">
            <DialogHeader>
                <DialogTitle>Edit Status Transaksi</DialogTitle>
                <DialogDescription>Form ini akan mengubah status transaksi tunai.</DialogDescription>
            </DialogHeader>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Status Transaksi" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="settlement">Lunas</SelectItem>
                                            <SelectItem value="pending">Belum Lunas</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Simpan</Button>
                </form>
            </Form>
        </DialogContent>
    );
}

export default FormUpdateStatus;

"use client";

import React from "react";
import type { Barberman, Paket } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Script from "next/script";
import { useRouter } from "next/navigation";

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn, currencyFormatter } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { insertTransaction, updateTransaction } from "@/actions/transaction-actions";
import { transaksiSchema } from "@/lib/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

declare global {
    interface Window {
        snap: any;
    }
}

interface FormBookingProps {
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
    barberman: Barberman[];
    dataPaket: Paket;
    antrian: number | string | null;
}

function FormBooking({ setOpenModal, barberman, dataPaket, antrian }: FormBookingProps) {
    // hooks
    const router = useRouter();

    const form = useForm<z.infer<typeof transaksiSchema>>({
        resolver: zodResolver(transaksiSchema),
    });

    // states
    const [selectedBarberman, setSelectedBarberman] = React.useState<string>("");

    // events
    const onSubmit = async (values: z.infer<typeof transaksiSchema>) => {
        const response = await insertTransaction(values, dataPaket.id);
        window.snap.pay(response?.data.token, {
            async onSuccess(result: any) {
                await updateTransaction(result);
                toast("Transaksi berhasil dilakukan!");
                router.push("/success");
            },
            async onPending(result: any) {
                await updateTransaction(result);
                toast("Transaksi berhasil dilakukan!");
                router.push("/riwayat-transaksi");
            },
            async onError(result: any) {
                await updateTransaction(result);
                toast("Opps, terjadi kesalahan!");
            },
            onClose() {
                //
            },
        });
        setOpenModal(false);
    };

    return (
        <>
            <Script
                src={process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL}
                data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
                strategy="lazyOnload"
            />

            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Konfirmasi Booking</DialogTitle>
                    <DialogDescription>Silahkan konfirmasi bookingan anda.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="barberman"
                            render={({ field }) => (
                                <FormItem>
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            setSelectedBarberman(value);
                                        }}
                                        defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="max-w-sm">
                                                <SelectValue placeholder="Pilih Barberman" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {barberman.map((item) => (
                                                <SelectItem
                                                    key={item.id}
                                                    value={item.name}
                                                    disabled={item.status !== "online"}>
                                                    <div className="inline-flex w-full flex-row items-center gap-2">
                                                        <div
                                                            className={cn(
                                                                "h-2 w-2 rounded-full",
                                                                item.status === "online"
                                                                    ? "bg-green-500"
                                                                    : "bg-red-500",
                                                            )}
                                                        />
                                                        {item.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th colSpan={2} className="text-left">
                                        Detail Transaksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="w-full">
                                <tr className="w-full">
                                    <td className="w-full text-left">{dataPaket.name}</td>
                                    <td className="w-full text-nowrap text-right font-bold">
                                        {currencyFormatter(dataPaket.price)}
                                    </td>
                                </tr>
                                <tr className="w-full">
                                    <td className="w-full text-left">Barberman</td>
                                    <td className="w-full text-nowrap text-right font-bold">
                                        {selectedBarberman ?? "-"}
                                    </td>
                                </tr>
                                <tr className="w-full">
                                    <td className="w-full text-left">No Antrian</td>
                                    <td className="w-full text-nowrap text-right font-bold">{antrian ?? "-"}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr className="w-full border-t border-border">
                                    <td className="text-left font-bold">Total</td>
                                    <td className="text-nowrap text-right font-bold">
                                        {currencyFormatter(dataPaket.price)},-
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Bayar
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </>
    );
}

export default FormBooking;

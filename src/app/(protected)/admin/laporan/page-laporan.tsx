/* eslint-disable no-nested-ternary */

"use client";

import React from "react";
import { DateRange } from "react-day-picker";
import { addMonths, format } from "date-fns";
import { id } from "date-fns/locale";
import { useReactToPrint } from "react-to-print";
import { Calendar as CalendarIcon, Printer, ShowerHead } from "lucide-react";

import type { Transaksi } from "@prisma/client";
import { cn, currencyFormatter } from "@/lib/utils";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { getTransactions } from "@/actions/transaction-actions";

type TransactionWithUserAndPaket = Transaksi & {
    user: {
        name: string;
    };
    paket: {
        name: string;
    };
};
function PageLaporan() {
    // states
    const today = new Date();
    const oneMonthLater = addMonths(today, 1);
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: today,
        to: oneMonthLater,
    });
    const [data, setData] = React.useState<TransactionWithUserAndPaket[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const printRef = React.useRef(null);

    // events

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        copyStyles: true,
    });
    const handleTampilkan = async () => {
        if (!date || !date.from || !date.to) {
            toast("Harap pilih tanggal terlebih dahulu");
            return;
        }

        try {
            setLoading(true);
            const transactions = await getTransactions(date.from, date.to);
            setData(transactions as TransactionWithUserAndPaket[]);
        } catch (error) {
            toast.error("Terjadi kesalahan saat mengambil data transaksi.");
        } finally {
            setLoading(false);
        }
    };

    // table
    const columns = [
        { name: "#", className: "text-center w-10" },
        { name: "Tanggal", className: "text-left" },
        { name: "Invoice", className: "text-left" },
        { name: "Nama", className: "text-left" },
        { name: "Paket", className: "text-left" },
        { name: "Barberman", className: "text-left" },
        { name: "No Antrian", className: "text-left" },
        { name: "Via", className: "text-left" },
        { name: "Total", className: "text-left" },
        { name: "Status", className: "text-left" },
    ];

    return (
        <div className="flex flex-col space-y-5">
            <Header title="Laporan" />

            <div className="flex flex-col space-y-5">
                <div className="flex items-center gap-5">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant="outline"
                                className={cn(
                                    "w-[400px] justify-start text-left font-normal",
                                    !date && "text-muted-foreground",
                                )}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date?.from ? (
                                    date.to ? (
                                        <>
                                            {format(date.from, "d MMMM y", { locale: id })} -{" "}
                                            {format(date.to, "d MMMM y", { locale: id })}
                                        </>
                                    ) : (
                                        format(date.from, "d MMMM y", { locale: id })
                                    )
                                ) : (
                                    <span>Pick a date</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={setDate}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>

                    <Button
                        type="button"
                        className="inline-flex items-center justify-center gap-2"
                        onClick={handleTampilkan}>
                        <ShowerHead className="h-4 w-4" />
                        <span>Tampilkan</span>
                    </Button>
                </div>
                <Separator />

                {data.length > 0 && (
                    <div className="flex justify-end">
                        <Button type="button" onClick={handlePrint} className="inline-flex w-fit items-center gap-2">
                            <Printer className="h-4 w-4" />
                            <span>Print</span>
                        </Button>
                    </div>
                )}
                <div ref={printRef} className="flex flex-col">
                    <div className="w-full overflow-hidden rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-primary">
                                    {columns.map((item, index) => (
                                        <TableHead
                                            key={index}
                                            className={cn(item.className, "text-primary-foreground")}>
                                            {item.name}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className={cn("p-4 text-center")}>
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : data.length <= 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className={cn("p-4 text-center")}>
                                            Silahkan pilih tanggal terlebih dahulu, lalu tekan tombol tampilkan.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data.map((item, index) => (
                                        <TableRow
                                            key={item.id}
                                            className="odd:bg-white even:bg-muted dark:odd:bg-slate-700">
                                            <TableCell className="text-center">{index + 1}</TableCell>
                                            <TableCell>{format(item.createdAt, "d MMMM y", { locale: id })}</TableCell>
                                            <TableCell>{item.invoice}</TableCell>
                                            <TableCell>{item.user.name}</TableCell>
                                            <TableCell>{item.paket.name}</TableCell>
                                            <TableCell>{item.namaBarberman}</TableCell>
                                            <TableCell>{item.noAntrian}</TableCell>
                                            <TableCell>{item.via}</TableCell>
                                            <TableCell>
                                                {item.total !== null ? currencyFormatter(item.total) : "-"}
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={cn(
                                                        "rounded-md px-3 py-1 text-sm text-white",
                                                        item.status === "settlement" ? "bg-green-500" : "bg-red-500",
                                                    )}>
                                                    {item.status === "settlement" ? "Lunas" : "Belum Lunas"}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow className="bg-primary text-primary-foreground">
                                    <TableCell colSpan={columns.length - 2} className="py-4">
                                        Total
                                    </TableCell>
                                    <TableCell colSpan={2} className="py-4">
                                        {currencyFormatter(data.reduce((acc, item) => acc + (item.total ?? 0), 0))}
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PageLaporan;

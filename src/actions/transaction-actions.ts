"use server";

import { createTransaction } from "@/lib/midtrans";
import { generateInvoice, generateNoAntrian } from "@/lib/utils";
import { getPaketById } from "@/actions/paket-actions";
import { z } from "zod";
import { auth } from "@/auth";
import prisma from "@/lib/db";
import { transaksiSchema } from "@/lib/zod";

export const insertTransaction = async (data: z.infer<typeof transaksiSchema>, idPaket: string) => {
    try {
        const session = await auth();
        if (!session?.user) return null;

        const { user } = session;
        const paket = await getPaketById(idPaket);
        const invoice = generateInvoice(user.name!);
        const queueNumber = await generateNoAntrian();

        const params = {
            transaction_details: {
                order_id: invoice,
                gross_amount: paket?.price,
            },
            customer_details: {
                first_name: user.name,
                last_name: "",
                email: user.email,
                phone: user.phone || "",
            },
        };

        const response = await createTransaction(params);
        await prisma.transaksi.create({
            data: {
                paket: { connect: { id: idPaket } },
                user: { connect: { id: user.id } },
                namaBarberman: data.barberman as string,
                invoice: invoice as string,
                snapToken: response.token as string,
                snapUrl: response.redirect_url as string,
                noAntrian: queueNumber,
                total: paket?.price,
            },
        });

        return {
            success: true,
            data: response,
            message: "Transaksi berhasil dilakukan!",
        };
    } catch (error) {
        throw new Error("Terjadi kesalahan!");
    }
};

export const updateTransaction = async (data: any) => {
    try {
        const session = await auth();
        if (!session?.user) return null;

        const transaksi = await prisma.transaksi.findUnique({
            where: {
                invoice: data.order_id as string,
            },
        });

        if (!transaksi) return null;

        await prisma.transaksi.update({
            where: {
                invoice: data.order_id as string,
            },
            data: {
                via: data.payment_type as string,
                status: data.transaction_status as string,
            },
        });

        return {
            success: true,
            data: null,
            message: "Transaksi berhasil dilakukan!",
        };
    } catch (error) {
        throw new Error("Terjadi kesalahan!");
    }
};

export const getTransactions = async (fromDate: Date, toDate: Date) => {
    try {
        const session = await auth();
        if (!session?.user) return null;

        const transactions = await prisma.transaksi.findMany({
            where: {
                AND: [
                    { updatedAt: { gte: new Date(fromDate) } },
                    { updatedAt: { lte: new Date(toDate) } },
                    { status: "settlement" },
                ],
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
                paket: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return transactions;
    } catch (error) {
        throw new Error("Terjadi kesalahan!");
    }
};

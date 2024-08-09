"use server";

import { auth } from "@/auth";
import prisma from "@/lib/db";

export const getRiwayatTransaksi = async (query: string, take: number, currentPage: number) => {
    const offset = (currentPage - 1) * take;

    try {
        const session = await auth();
        if (!session?.user) return null;

        const transaksi = await prisma.transaksi.findMany({
            where: {
                AND: [{ user: { email: session.user.email! } }],
                OR: [
                    { noAntrian: { contains: query, mode: "insensitive" } },
                    { paket: { name: { contains: query, mode: "insensitive" } } },
                    { invoice: { contains: query, mode: "insensitive" } },
                    { via: { contains: query, mode: "insensitive" } },
                    { status: { contains: query, mode: "insensitive" } },
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
            orderBy: { createdAt: "desc" },
            skip: offset ?? 0,
            take: take ?? 8,
        });

        return transaksi;
    } catch (error) {
        throw new Error("Terjadi kesalahan!");
    }
};

export const getRiwayatTransaksiPages = async (query: string, take: number) => {
    try {
        const session = await auth();
        if (!session?.user) return null;

        const transaksi = await prisma.transaksi.count({
            where: {
                AND: [{ user: { email: session.user.email! } }],
                OR: [
                    { noAntrian: { contains: query, mode: "insensitive" } },
                    { paket: { name: { contains: query, mode: "insensitive" } } },
                    { invoice: { contains: query, mode: "insensitive" } },
                    { via: { contains: query, mode: "insensitive" } },
                    { status: { contains: query, mode: "insensitive" } },
                ],
            },
        });
        const totalPages = Math.ceil(Number(transaksi) / take);
        return totalPages;
    } catch (error) {
        throw new Error("Terjadi kesalahan!");
    }
};

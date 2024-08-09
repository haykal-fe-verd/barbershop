"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export const getAllAntrianToday = async () => {
    try {
        const antrian = await prisma.transaksi.findMany({
            where: {
                AND: [
                    { updatedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
                    { updatedAt: { lte: new Date(new Date().setHours(23, 59, 59, 999)) } },
                ],
            },
            orderBy: {
                noAntrian: "asc",
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
        return antrian;
    } catch (error) {
        throw new Error("Terjadi kesalahan!");
    }
};

export const setAntrianActive = async (id: string) => {
    try {
        const antrian = await prisma.transaksi.update({
            where: {
                id,
            },
            data: {
                isActiveAntrian: true,
            },
        });

        revalidatePath("/admin/antrian");
        revalidatePath("/dashboard");
        return antrian;
    } catch (error) {
        throw new Error("Terjadi kesalahan!");
    }
};

export const setAntrianInactive = async (id: string) => {
    try {
        const antrian = await prisma.transaksi.update({
            where: {
                id,
            },
            data: {
                isActiveAntrian: false,
            },
        });

        revalidatePath("/admin/antrian");
        revalidatePath("/dashboard");
        return antrian;
    } catch (error) {
        throw new Error("Terjadi kesalahan!");
    }
};

export const getTransaksi = async (query: string, take: number, currentPage: number) => {
    const offset = (currentPage - 1) * take;

    try {
        const transaksi = await prisma.transaksi.findMany({
            where: {
                OR: [
                    { noAntrian: { contains: query, mode: "insensitive" } },
                    { user: { name: { contains: query, mode: "insensitive" } } },
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

export const getTransaksiPages = async (query: string, take: number) => {
    try {
        const transaksi = await prisma.transaksi.count({
            where: {
                OR: [
                    { noAntrian: { contains: query, mode: "insensitive" } },
                    { user: { name: { contains: query, mode: "insensitive" } } },
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

export const updateTransaksiStatus = async (id: string, status: string) => {
    try {
        await prisma.transaksi.update({
            where: {
                id,
            },
            data: {
                status,
            },
        });

        revalidatePath("/admin/transaksi");
        return { message: "Status berhasil diubah!" };
    } catch (error) {
        throw new Error("Terjadi kesalahan!");
    }
};

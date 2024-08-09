"use server";

import { auth } from "@/auth";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export const getAntrianBerjalanSekarang = async () => {
    try {
        const antrian = await prisma.transaksi.findFirst({
            where: {
                AND: [
                    { updatedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
                    { updatedAt: { lte: new Date(new Date().setHours(23, 59, 59, 999)) } },
                    { isActiveAntrian: true },
                ],
            },
        });

        revalidatePath("/dashboard");
        return antrian;
    } catch (error) {
        throw new Error("Terjadi kesalahan!");
    }
};

export const getTotalTransaksi = async () => {
    try {
        const totalTransaksiHariIni = await prisma.transaksi.count({
            where: {
                AND: [
                    { updatedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
                    { updatedAt: { lte: new Date(new Date().setHours(23, 59, 59, 999)) } },
                ],
            },
        });

        revalidatePath("/dashboard");
        return totalTransaksiHariIni;
    } catch (error) {
        throw new Error("Terjadi kesalahan!");
    }
};

export const getTotalAdmin = async () => {
    try {
        const totalAdmin = await prisma.user.count({
            where: {
                role: "admin",
            },
        });
        revalidatePath("/dashboard");
        return totalAdmin;
    } catch (error) {
        throw new Error("Terjadi kesalahan!");
    }
};

export const getTotalBarberman = async () => {
    try {
        const totalBarberman = await prisma.barberman.count();
        revalidatePath("/dashboard");
        return totalBarberman;
    } catch (error) {
        throw new Error("Terjadi kesalahan!");
    }
};

export const getTotalPaket = async () => {
    try {
        const totalPaket = await prisma.paket.count();
        revalidatePath("/dashboard");
        return totalPaket;
    } catch (error) {
        throw new Error("Terjadi kesalahan!");
    }
};

export const getCountTransaksiSaya = async () => {
    try {
        const session = await auth();
        if (!session?.user) return null;

        const transaksiSaya = await prisma.transaksi.count({ where: { user: { email: session.user.email! } } });

        revalidatePath("/dashboard");
        return transaksiSaya;
    } catch (error) {
        throw new Error("Terjadi kesalahan!");
    }
};

export const getTigaPaket = async () => {
    try {
        const paket = await prisma.paket.findMany({ take: 3, orderBy: { name: "asc" } });
        revalidatePath("/dashboard");
        return paket;
    } catch (error) {
        throw new Error("Terjadi kesalahan!");
    }
};

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

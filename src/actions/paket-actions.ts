"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/db";
import { paketSchema } from "@/lib/zod";

export const getAllPaket = async () => {
    try {
        const paket = await prisma.paket.findMany();
        return paket;
    } catch (error) {
        throw new Error("Terjadi kesalahan!");
    }
};

export const getPaket = async (query: string, take: number, currentPage: number) => {
    const offset = (currentPage - 1) * take;

    try {
        const paket = await prisma.paket.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { price: { equals: parseInt(query, 10) || 0 } },
                ],
            },
            orderBy: { createdAt: "desc" },
            skip: offset ?? 0,
            take: take ?? 8,
        });
        return paket;
    } catch (error) {
        throw new Error("Terjadi kesalahan!");
    }
};

export const getPaketPages = async (query: string, take: number) => {
    try {
        const paket = await prisma.paket.count({
            where: {
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { price: { equals: parseInt(query, 10) || 0 } },
                ],
            },
        });
        const totalPages = Math.ceil(Number(paket) / take);
        return totalPages;
    } catch (error) {
        throw new Error("Terjadi kesalahan!");
    }
};

export const getPaketById = async (id: string) => {
    try {
        const result = await prisma.paket.findUnique({
            where: {
                id,
            },
        });

        return result;
    } catch (error) {
        throw new Error("Terjadi kesalahan");
    }
};

export const insertPaket = async (prevState: any, formdata: FormData) => {
    try {
        // validate form
        const validatedFields = paketSchema.safeParse(Object.fromEntries(formdata));
        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }

        const { name, price } = validatedFields.data;

        await prisma.paket.create({
            data: {
                name,
                price,
            },
        });

        revalidatePath("/admin/paket");
        return {
            succes: true,
            message: "Data paket berhasil ditambahkan",
        };
    } catch (error) {
        return {
            errors: "Terjadi kesalahan!",
        };
    }
};

export const updatePaket = async (id: string, prevState: any, formdata: FormData) => {
    // validate form
    const validatedFields = paketSchema.safeParse(Object.fromEntries(formdata));
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const data = await getPaketById(id);
    if (!data) return { errors: "Data tidak ditemukan" };

    const { name, price } = validatedFields.data;

    try {
        await prisma.paket.update({
            data: {
                name,
                price,
            },
            where: { id },
        });
        revalidatePath("/admin/paket");

        return {
            succes: true,
            message: "Data paket berhasil diupdate",
        };
    } catch (error) {
        return {
            errors: "Terjadi kesalahan!",
        };
    }
};

export const deletePaket = async (id: string) => {
    const data = await getPaketById(id);
    if (!data) return { errors: "Data tidak ditemukan" };

    try {
        await prisma.paket.delete({
            where: {
                id,
            },
        });
        revalidatePath("/admin/paket");
        return {
            message: "Data paket berhasil dihapus",
        };
    } catch (error) {
        return {
            errors: "Terjadi kesalahan!",
        };
    }
};

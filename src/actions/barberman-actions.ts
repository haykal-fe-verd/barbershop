"use server";

import { put, del } from "@vercel/blob";
import { revalidatePath } from "next/cache";

import prisma from "@/lib/db";
import { barbermanSchema, updateBarbermanSchema } from "@/lib/zod";

export const getAllBarberman = async () => {
    try {
        const barberman = await prisma.barberman.findMany({ orderBy: { name: "asc" } });
        return barberman;
    } catch (error) {
        throw new Error("Terjadi kesalahan!");
    }
};

export const getBarberman = async (query: string, take: number, currentPage: number) => {
    const offset = (currentPage - 1) * take;

    try {
        const barberman = await prisma.barberman.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { status: { contains: query, mode: "insensitive" } },
                ],
            },
            orderBy: { createdAt: "desc" },
            skip: offset ?? 0,
            take: take ?? 8,
        });
        return barberman;
    } catch (error) {
        throw new Error("Terjadi kesalahan");
    }
};

export const getBarbermanPages = async (query: string, take: number) => {
    try {
        const contacts = await prisma.barberman.count({
            where: {
                OR: [
                    {
                        name: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                    {
                        status: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                ],
            },
        });
        const totalPages = Math.ceil(Number(contacts) / take);
        return totalPages;
    } catch (error) {
        throw new Error("Terjadi kesalahan");
    }
};

export const getBarbermanById = async (id: string) => {
    try {
        const result = await prisma.barberman.findUnique({
            where: {
                id,
            },
        });

        return result;
    } catch (error) {
        throw new Error("Terjadi kesalahan");
    }
};

export const insertBarberman = async (prevState: any, formdata: FormData) => {
    try {
        // validate form
        const validatedFields = barbermanSchema.safeParse(Object.fromEntries(formdata));
        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }

        const { name, image, status } = validatedFields.data;
        const { url } = await put(image.name, image, { access: "public", multipart: true });

        await prisma.barberman.create({
            data: {
                name,
                status,
                image: url,
            },
        });

        revalidatePath("/admin/barberman");
        return {
            succes: true,
            message: "Data barberman berhasil ditambahkan",
        };
    } catch (error) {
        return {
            errors: "Terjadi kesalahan saat menyimpan data, silahkan coba lagi",
        };
    }
};

export const updateBarberman = async (id: string, prevState: any, formdata: FormData) => {
    // validate form
    const validatedFields = updateBarbermanSchema.safeParse(Object.fromEntries(formdata));
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const data = await getBarbermanById(id);
    if (!data) return { errors: "Data tidak ditemukan" };

    const { name, image, status } = validatedFields.data;
    let imagePath;

    if (!image || image.size <= 0) {
        imagePath = data.image;
    } else {
        await del(data.image!);
        const { url } = await put(image.name, image, {
            access: "public",
            multipart: true,
        });
        imagePath = url;
    }

    try {
        await prisma.barberman.update({
            data: {
                name,
                status,
                image: imagePath,
            },
            where: { id },
        });
        revalidatePath("/admin/barberman");

        return {
            succes: true,
            message: "Data barberman berhasil diupdate",
        };
    } catch (error) {
        return {
            errors: "Terjadi kesalahan saat mengupdate data, silahkan coba lagi",
        };
    }
};

export const deleteBarberman = async (id: string) => {
    const data = await getBarbermanById(id);
    if (!data) return { errors: "Data tidak ditemukan" };

    try {
        await del(data.image!);
        await prisma.barberman.delete({
            where: {
                id,
            },
        });
        revalidatePath("/admin/barberman");
        return {
            message: "Data barberman berhasil dihapus",
        };
    } catch (error) {
        return {
            errors: "Terjadi kesalahan",
        };
    }
};

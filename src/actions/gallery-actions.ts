"use server";

import { put, del } from "@vercel/blob";
import { revalidatePath } from "next/cache";

import prisma from "@/lib/db";
import { gallerySchema, updateGallerySchema } from "@/lib/zod";

export const getAllGallery = async () => {
    try {
        const galleries = await prisma.gallery.findMany({
            orderBy: { createdAt: "desc" },
        });

        return galleries;
    } catch (error) {
        throw new Error("Terjadi kesalahan!");
    }
};
export const getGallery = async (query: string, take: number, currentPage: number) => {
    const offset = (currentPage - 1) * take;

    try {
        const galleries = await prisma.gallery.findMany({
            where: {
                OR: [{ description: { contains: query, mode: "insensitive" } }],
            },
            orderBy: { createdAt: "desc" },
            skip: offset ?? 0,
            take: take ?? 8,
        });
        return galleries;
    } catch (error) {
        throw new Error("Terjadi kesalahan!");
    }
};

export const getGalleryPages = async (query: string, take: number) => {
    try {
        const gellery = await prisma.gallery.count({
            where: {
                OR: [
                    {
                        description: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                ],
            },
        });
        const totalPages = Math.ceil(Number(gellery) / take);
        return totalPages;
    } catch (error) {
        throw new Error("Terjadi kesalahan!");
    }
};

export const getGalleryById = async (id: string) => {
    try {
        const result = await prisma.gallery.findUnique({
            where: {
                id,
            },
        });

        return result;
    } catch (error) {
        throw new Error("Terjadi kesalahan");
    }
};

export const insertGallery = async (prevState: any, formdata: FormData) => {
    try {
        // validate form
        const validatedFields = gallerySchema.safeParse(Object.fromEntries(formdata));
        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }

        const { description, image } = validatedFields.data;
        const { url } = await put(image.name, image, { access: "public", multipart: true });

        await prisma.gallery.create({
            data: {
                description,
                image: url,
            },
        });

        revalidatePath("/admin/gallery");
        return {
            succes: true,
            message: "Data gallery berhasil ditambahkan",
        };
    } catch (error) {
        return {
            errors: "Terjadi kesalahan!",
        };
    }
};

export const updateGallery = async (id: string, prevState: any, formdata: FormData) => {
    // validate form
    const validatedFields = updateGallerySchema.safeParse(Object.fromEntries(formdata));
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const data = await getGalleryById(id);
    if (!data) return { errors: "Data tidak ditemukan" };

    const { description, image } = validatedFields.data;
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
        await prisma.gallery.update({
            data: {
                description,
                image: imagePath,
            },
            where: { id },
        });
        revalidatePath("/admin/gallery");

        return {
            succes: true,
            message: "Data gallery berhasil diupdate",
        };
    } catch (error) {
        return {
            errors: "Terjadi kesalahan!",
        };
    }
};

export const deleteGallery = async (id: string) => {
    const data = await getGalleryById(id);
    if (!data) return { errors: "Data tidak ditemukan" };

    try {
        await del(data.image!);
        await prisma.gallery.delete({
            where: {
                id,
            },
        });
        revalidatePath("/admin/gallery");
        return {
            message: "Data gallery berhasil dihapus",
        };
    } catch (error) {
        return {
            errors: "Terjadi kesalahan!",
        };
    }
};

"use server";

import { put, del } from "@vercel/blob";
import { revalidatePath } from "next/cache";

import prisma from "@/lib/db";
import { updateUserSchema, userSchema } from "@/lib/zod";
import { hashedPassword } from "@/lib/utils";

export const getUsers = async (query: string, take: number, currentPage: number) => {
    const offset = (currentPage - 1) * take;

    try {
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { email: { contains: query, mode: "insensitive" } },
                    { phone: { contains: query, mode: "insensitive" } },
                    { role: { contains: query, mode: "insensitive" } },
                ],
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                image: true,
                createdAt: true,
                updatedAt: true,
                password: false,
            },
            orderBy: { role: "asc" },
            skip: offset ?? 0,
            take: take ?? 8,
        });
        return users;
    } catch (error) {
        throw new Error("Terjadi kesalahan!");
    }
};

export const getUsersPages = async (query: string, take: number) => {
    try {
        const users = await prisma.user.count({
            where: {
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { email: { contains: query, mode: "insensitive" } },
                    { phone: { contains: query, mode: "insensitive" } },
                    { role: { contains: query, mode: "insensitive" } },
                ],
            },
        });
        const totalPages = Math.ceil(Number(users) / take);
        return totalPages;
    } catch (error) {
        throw new Error("Terjadi kesalahan!");
    }
};

export const getUsersById = async (id: string) => {
    try {
        const result = await prisma.user.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                image: true,
                createdAt: true,
                updatedAt: true,
                password: false,
            },
        });

        return result;
    } catch (error) {
        throw new Error("Terjadi kesalahan");
    }
};

export const insertUser = async (prevState: any, formdata: FormData) => {
    try {
        // validate form
        const validatedFields = userSchema.safeParse(Object.fromEntries(formdata));
        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }
        const { name, email, password, image, phone, role } = validatedFields.data;
        const bcryptPassword = await hashedPassword(password);

        // check existing
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
            include: {
                accounts: true,
            },
        });

        if (user) {
            const oauthAccounts = user.accounts.filter((account) => account.type === "oauth");
            if (oauthAccounts.length > 0) {
                return {
                    errors: "Untuk mengonfirmasi identitas Anda, masuk dengan akun yang sama dengan yang Anda gunakan sebelumnya (Google, GitHub).",
                };
            }

            revalidatePath("/admin/user");
            return {
                errors: "Email yang anda masukkan sudah terdaftar",
            };
        }

        let imagePath;
        if (!image || image.size <= 0) {
            imagePath = "";
        } else {
            const { url } = await put(image.name, image, {
                access: "public",
                multipart: true,
            });
            imagePath = url;
        }

        await prisma.user.create({
            data: {
                name,
                email,
                emailVerified: new Date(),
                password: bcryptPassword,
                phone,
                role,
                image: imagePath,
            },
        });

        revalidatePath("/admin/user");
        return {
            succes: true,
            message: "Data user berhasil ditambahkan",
        };
    } catch (error) {
        return {
            errors: "Terjadi kesalahan!",
        };
    }
};

export const updateUser = async (id: string, prevState: any, formdata: FormData) => {
    try {
        // validate form
        const validatedFields = updateUserSchema.safeParse(Object.fromEntries(formdata));
        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }
        const { name, email, password, image, phone, role } = validatedFields.data;

        // Ambil data user yang akan diupdate
        const existingUser = await prisma.user.findUnique({
            where: { id },
        });

        if (!existingUser) {
            return { errors: "User tidak ditemukan" };
        }

        let passwordHash = existingUser.password;
        if (password) {
            passwordHash = await hashedPassword(password);
        }

        let imagePath;
        if (!image || image.size <= 0) {
            imagePath = existingUser.image;
        } else {
            await del(existingUser.image!);
            const { url } = await put(image.name, image, {
                access: "public",
                multipart: true,
            });
            imagePath = url;
        }

        await prisma.user.update({
            where: { id },
            data: {
                name,
                email,
                password: passwordHash,
                phone,
                role,
                image: imagePath,
            },
        });

        revalidatePath("/admin/user");
        return {
            succes: true,
            message: "Data user berhasil diperbarui",
        };
    } catch (error) {
        return {
            errors: "Terjadi kesalahan!",
        };
    }
};

export const deleteUser = async (id: string) => {
    try {
        const data = await getUsersById(id);
        if (!data) return { errors: "Data tidak ditemukan" };
        if (data.image) {
            await del(data.image!);
        }

        await prisma.user.delete({
            where: { id },
        });

        revalidatePath("/admin/user");
        return {
            message: "Data user berhasil dihapus",
        };
    } catch (error) {
        return {
            errors: "Terjadi kesalahan",
        };
    }
};

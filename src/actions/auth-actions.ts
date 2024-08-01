"use server";

import { z } from "zod";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { put, del } from "@vercel/blob";

import { signIn } from "@/auth";
import { forgotPasswordSchema, loginSchema, newPasswordSchema, registerSchema, updateProfileSchema } from "@/lib/zod";
import { hashedPassword } from "@/lib/utils";
import prisma from "@/lib/db";
import {
    createVerificationToken,
    deleteVerificationTokenByEmail,
    getVerificationTokenByToken,
} from "@/lib/verification-token";
import { getUserByEmail } from "@/lib/user";
import { sendForgotPasswordEmail, sendVerificationEmail } from "@/lib/mail";
import {
    createForgotPasswordToken,
    deletForgotPasswordTokenByEmail,
    getForgotPasswordTokenByToken,
} from "@/lib/forgot-password-token";

export async function login(values: z.infer<typeof loginSchema>) {
    // validate
    const validated = loginSchema.safeParse(values);

    if (!validated.success) {
        revalidatePath("/login");
        return {
            message: "Validasi error",
            error: "Kredensial yang anda masukkan tidak valid",
        };
    }

    const { email, password } = validated.data;

    const existingUser = await getUserByEmail(email);
    if (!existingUser || !existingUser.email || !existingUser.password) {
        revalidatePath("/login");
        return { error: "Email yang anda masukkan tidak terdaftar" };
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await createVerificationToken(existingUser.email);
        await sendVerificationEmail(verificationToken?.identifier!, verificationToken?.token!);

        revalidatePath("/login");
        return {
            message: "Email verifikasi telah dikirim. Silahkan cek email Anda.",
            error: null,
        };
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        revalidatePath("/login");
        return { success: true, message: "" };
    } catch (error) {
        if (error instanceof AuthError) {
            revalidatePath("/login");
            return { error: error.cause?.err?.message };
        }

        return { error: "error 500" };
    }
}

export async function register(values: z.infer<typeof registerSchema>) {
    try {
        // validate
        const validated = registerSchema.safeParse(values);
        if (!validated.success) {
            revalidatePath("/register");
            return {
                message: "Validasi error",
                error: "Kredensial yang anda masukkan tidak valid",
            };
        }

        const { name, email, password } = validated.data;
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
                    error: "Untuk mengonfirmasi identitas Anda, masuk dengan akun yang sama dengan yang Anda gunakan sebelumnya (Google, GitHub).",
                };
            }

            revalidatePath("/register");
            return {
                message: "Validasi error",
                error: "Email yang anda masukkan sudah terdaftar",
            };
        }

        // create user
        await prisma.user.create({
            data: {
                name,
                email,
                password: bcryptPassword,
            },
        });

        // send mail verification
        const verificationToken = await createVerificationToken(email);
        await sendVerificationEmail(verificationToken?.identifier!, verificationToken?.token!);

        revalidatePath("/register");
        return {
            message: "Email verifikasi telah dikirim. Silahkan cek email Anda.",
            error: null,
        };
    } catch (error) {
        if (error instanceof AuthError) {
            return { error: error.cause?.err?.message };
        }

        return { error: "error 500" };
    }
}

export const newVerificationToken = async (token: string) => {
    const existingToken = await getVerificationTokenByToken(token);
    if (!existingToken) {
        revalidatePath("/new-verification");
        return { error: "Token tidak valid!" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
        revalidatePath("/new-verification");
        return { error: "Token kamu telah kadaluarsa!" };
    }

    const existingUser = await getUserByEmail(existingToken.identifier);
    if (!existingUser) {
        revalidatePath("/new-verification");
        return { error: "Email kamu tidak terdaftar!" };
    }

    await prisma.user.update({
        where: {
            id: existingUser.id,
        },
        data: {
            emailVerified: new Date(),
            email: existingToken.identifier,
        },
    });

    await deleteVerificationTokenByEmail(existingToken.identifier);

    revalidatePath("/new-verification");
    return { success: true, message: "Email berhasil diverifikasi" };
};

export const forgotPassword = async (values: z.infer<typeof forgotPasswordSchema>) => {
    // validate
    const validated = forgotPasswordSchema.safeParse(values);

    if (!validated.success) {
        revalidatePath("/forgot-password");
        return {
            message: "Validasi error",
            error: "Kredensial yang anda masukkan tidak valid",
        };
    }

    const { email } = validated.data;
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
        revalidatePath("/forgot-password");
        return {
            error: "Email yang anda masukkan tidak terdaftar",
        };
    }

    const forgotPasswordToken = await createForgotPasswordToken(email);
    await sendForgotPasswordEmail(forgotPasswordToken?.identifier!, forgotPasswordToken?.token!);

    revalidatePath("/forgot-password");
    return {
        message: "Email lupa password telah dikirim. Silahkan cek email Anda.",
    };
};

export const newPassword = async (values: z.infer<typeof newPasswordSchema>, token: string) => {
    // validate
    const validated = newPasswordSchema.safeParse(values);
    if (!token) {
        return { error: "Token tidak valid!" };
    }
    if (!validated.success) {
        revalidatePath("/new-password");
        return {
            message: "Validasi error",
            error: "Kredensial yang anda masukkan tidak valid",
        };
    }

    const existingToken = await getForgotPasswordTokenByToken(token);
    if (!existingToken) {
        revalidatePath("/new-password");
        return { error: "Token tidak valid!" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
        revalidatePath("/new-password");
        return { error: "Token kamu telah kadaluarsa!" };
    }

    const existingUser = await getUserByEmail(existingToken.identifier);
    if (!existingUser) {
        revalidatePath("/new-password");
        return { error: "Email kamu tidak terdaftar!" };
    }

    const { password } = validated.data;
    const passwordHash = await hashedPassword(password);

    await prisma.user.update({
        where: {
            id: existingUser.id,
        },
        data: {
            password: passwordHash,
        },
    });

    await deletForgotPasswordTokenByEmail(existingToken.identifier);

    revalidatePath("/new-password");
    return { success: true, message: "Password berhasil dirubah" };
};

export const updateProfile = async (id: string, prevState: any, formdata: FormData) => {
    try {
        // validate
        const validatedFields = updateProfileSchema.safeParse(Object.fromEntries(formdata));
        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }

        const { name, email, password, image, phone } = validatedFields.data;
        const existingUser = await getUserByEmail(email);

        if (!existingUser) return { errors: "Data tidak ditemukan!" };

        let passwordHash = existingUser.password;
        if (password) {
            passwordHash = await hashedPassword(password);
        }

        let imagePath;
        if (!image || image.size <= 0) {
            imagePath = existingUser.image;
        } else {
            if (existingUser.image) {
                await del(existingUser.image!);
            }
            const { url } = await put(image.name, image, {
                access: "public",
                multipart: true,
            });
            imagePath = url;
        }

        const user = await prisma.user.update({
            where: {
                id: existingUser.id,
            },
            data: {
                name,
                email,
                password: passwordHash,
                image: imagePath,
                phone,
            },
        });

        revalidatePath("/profile");
        return {
            succes: true,
            message: "Profile berhasil diupdate",
            data: user,
        };
    } catch (error) {
        return { errors: "Terjadi kesalahan!" };
    }
};

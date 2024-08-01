import prisma from "@/lib/db";
import { generateToken } from "@/lib/utils";

export async function getForgotPasswordTokenByEmail(email: string) {
    try {
        const forgotToken = await prisma.passwordResetToken.findFirst({
            where: {
                identifier: email,
            },
        });

        return forgotToken;
    } catch (error) {
        return null;
    }
}

export async function getForgotPasswordTokenByToken(token: string) {
    try {
        const forgotToken = await prisma.passwordResetToken.findFirst({
            where: {
                token,
            },
        });

        return forgotToken;
    } catch (error) {
        return null;
    }
}

export async function deletForgotPasswordTokenByEmail(email: string) {
    try {
        await prisma.passwordResetToken.delete({
            where: {
                identifier: email,
            },
        });
    } catch (error) {
        return null;
    }
}

export async function createForgotPasswordToken(email: string) {
    const token = await generateToken();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    try {
        const existingToken = await getForgotPasswordTokenByEmail(email);
        if (existingToken) {
            await deletForgotPasswordTokenByEmail(email);
        }

        const forgotPasswordToken = await prisma.passwordResetToken.create({
            data: {
                identifier: email,
                token,
                expires,
            },
        });

        return forgotPasswordToken;
    } catch (error) {
        return null;
    }
}

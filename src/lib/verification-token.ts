import prisma from "@/lib/db";
import { generateToken } from "@/lib/utils";

export async function getVerificationTokenByEmail(email: string) {
    try {
        const verificationToken = await prisma.verificationToken.findFirst({
            where: {
                identifier: email,
            },
        });

        return verificationToken;
    } catch (error) {
        return null;
    }
}

export async function getVerificationTokenByToken(token: string) {
    try {
        const verificationToken = await prisma.verificationToken.findUnique({
            where: {
                token,
            },
        });

        return verificationToken;
    } catch (error) {
        return null;
    }
}

export async function deleteVerificationTokenByEmail(email: string) {
    try {
        await prisma.verificationToken.delete({
            where: {
                identifier: email,
            },
        });
    } catch (error) {
        return null;
    }
}

export async function createVerificationToken(email: string) {
    const token = await generateToken();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    try {
        const existingToken = await getVerificationTokenByEmail(email);
        if (existingToken) {
            await deleteVerificationTokenByEmail(email);
        }

        const verificationToken = await prisma.verificationToken.create({
            data: {
                identifier: email,
                token,
                expires,
            },
        });

        return verificationToken;
    } catch (error) {
        return null;
    }
}

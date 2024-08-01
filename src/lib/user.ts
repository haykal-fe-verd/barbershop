import prisma from "@/lib/db";

export const getUserByEmail = async (email: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        return user;
    } catch (error) {
        return null;
    }
};

export const getUserById = async (id: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        });

        return user;
    } catch (error) {
        return null;
    }
};

export const getUserAccountByEmail = async (email: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                accounts: true,
            },
        });
        if (!user) return { errors: "User tidak ditemukan" };

        const account = user.accounts.length > 0 ? user.accounts[0] : null;
        return account;
    } catch (error) {
        return null;
    }
};

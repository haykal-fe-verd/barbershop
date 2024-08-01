import type { NextAuthConfig } from "next-auth";

import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { loginSchema } from "@/lib/zod";
import { getUserByEmail } from "@/lib/user";
import { verifyPassword } from "@/lib/utils";

export default {
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        }),
        Github({
            clientId: process.env.AUTH_GITHUB_ID!,
            clientSecret: process.env.AUTH_GITHUB_SECRET!,
        }),
        Credentials({
            async authorize(credentials): Promise<any> {
                // validate
                const validated = loginSchema.safeParse(credentials);
                if (!validated.success) {
                    throw new Error("Kredensial yang anda masukkan tidak valid");
                }

                const user = await getUserByEmail(validated.data.email);

                // check if no user
                if (!user || !user.password) throw new Error("Email yang anda masukkan tidak terdaftar");

                // check password
                const passwordMatch = await verifyPassword(validated.data.password, user.password);
                if (!passwordMatch) {
                    throw new Error("Email/Password yang anda masukkan tidak valid");
                }

                // return user without password
                const { password, ...userWithoutPassword } = user;

                return userWithoutPassword;
            },
        }),
    ],
} satisfies NextAuthConfig;

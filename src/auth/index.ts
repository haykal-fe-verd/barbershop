/* eslint-disable no-param-reassign */

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import prisma from "@/lib/db";
import authConfig from "@/auth/auth.config";
import { getUserById } from "@/lib/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    trustHost: true,
    callbacks: {
        async signIn({ user, account }) {
            // allow without email verification
            if (account?.provider !== "credentials") return true;

            if (account?.provider === "credentials") {
                const existingUser = await getUserById(user.id as string);

                // prevent sign in without email verification
                if (!existingUser?.emailVerified) return false;
            }

            return true;
        },
        async jwt({ token, user, trigger, session }) {
            if (trigger === "update" && session) {
                token.name = session.name;
                token.picture = session.image;
                token.phone = session.phone;
            }

            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.phone = user.phone;
            }

            // update user in database
            await prisma.user.update({
                where: {
                    id: token.id as string,
                },
                data: {
                    name: token.name,
                    image: token.picture,
                    phone: token.phone,
                },
            });

            return token;
        },
        session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name;
                session.user.image = token.picture;
                session.user.role = token.role;
                session.user.phone = token.phone;
            }

            return session;
        },
    },
    events: {
        async linkAccount({ user }) {
            await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    emailVerified: new Date(),
                },
            });
        },
    },
    pages: {
        signIn: "/login",
        error: "/error",
    },
});

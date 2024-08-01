import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import authConfig from "@/auth/auth.config";
import {
    adminRoutes,
    apiAuthPrefix,
    authRoutes,
    DEFAULT_LOGIN_REDIRECT,
    publicRoutes,
    userRoutes,
} from "@/data/routes";

const { auth } = NextAuth(authConfig);

export default auth(async (request) => {
    const { nextUrl } = request;
    const isLoggedIn = !!request.auth;
    const secret = process.env.AUTH_SECRET as string;
    const user = await getToken({
        req: request,
        secret,
        salt: "authjs.session-token",
    });

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    const isAdminRoute = adminRoutes.includes(nextUrl.pathname);
    const isUserRoute = userRoutes.includes(nextUrl.pathname);

    // api auth routes should be public
    if (isApiAuthRoute) {
        return NextResponse.next();
    }

    // check auth route (login, register)
    if (isAuthRoute) {
        // redirect if logged in
        if (isLoggedIn) {
            return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }

        return NextResponse.next();
    }

    // redirect if not logged in
    if (!isLoggedIn && !isPublicRoute) {
        return NextResponse.redirect(new URL("/login", nextUrl));
    }

    // admin
    if (user?.role !== "admin" && isAdminRoute) {
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    // user
    if (user?.role !== "user" && isUserRoute) {
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

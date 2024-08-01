import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role?: string;
            phone?: string;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        role?: string;
        phone?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: string;
        phone?: string;
    }
}

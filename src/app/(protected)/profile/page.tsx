import React from "react";

import { auth } from "@/auth";
import { getUserAccountByEmail } from "@/lib/user";
import PageProfile from "./page-profile";

async function Page() {
    const session = await auth();

    if (!session?.user) return null;

    const account = await getUserAccountByEmail(session?.user.email!);

    return <PageProfile account={account} />;
}

export default Page;

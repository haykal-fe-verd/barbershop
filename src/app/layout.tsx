import type { Metadata } from "next";

import React from "react";
import { Inter as FontSans } from "next/font/google";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import ThemeDataProvider from "@/components/theme-data-provider";

import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
});

export const metadata: Metadata = {
    title: "Barbershop",
    description: "Simple barbershop app",
};

interface RootLayoutProps {
    children: React.ReactNode;
}

export default async function RootLayout({ children }: Readonly<RootLayoutProps>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head />

            <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
                <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    <ThemeDataProvider>
                        <main>{children}</main>
                        <Toaster />
                    </ThemeDataProvider>
                </NextThemesProvider>
            </body>
        </html>
    );
}

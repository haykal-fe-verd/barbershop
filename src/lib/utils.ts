import { type ClassValue, clsx } from "clsx";

import { twMerge } from "tailwind-merge";
import { nanoid, customAlphabet } from "nanoid";
import bcrypt from "bcryptjs";
import prisma from "./db";

const nanoid6 = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 6);

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function generateToken() {
    return nanoid();
}

export async function hashedPassword(password: string) {
    const passwordHash = await bcrypt.hash(password, 10);

    return passwordHash;
}

export async function verifyPassword(password: string, passowrdHash: string) {
    const isMatch = await bcrypt.compare(password, passowrdHash);

    return isMatch;
}

export function getInitial(name: string | null | undefined): string {
    if (!name) return "?";

    const nameParts = name.split(" ");
    const firstInitial = nameParts[0]?.charAt(0).toUpperCase() || "";
    const lastInitial = nameParts.length > 1 ? nameParts[1]?.charAt(0).toUpperCase() || "" : "";
    return firstInitial + lastInitial;
}

export function dateFormatter(dateStr: string) {
    const date = new Date(dateStr);
    const formatter = new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return formatter.format(date);
}

export const generatePagination = (currentPage: number, totalPages: number) => {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
        return [1, 2, 3, "...", totalPages - 1, totalPages];
    }

    if (currentPage >= totalPages - 2) {
        return [1, 2, 3, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
};

export const currencyFormatter = (value: number, currencyCode: string = "IDR", locale: string = "id-ID"): string => {
    const options: Intl.NumberFormatOptions = {
        style: "currency",
        currency: currencyCode,
        currencyDisplay: "symbol",
        minimumFractionDigits: 0,
    };

    return new Intl.NumberFormat(locale, options).format(value);
};

export const formatName = (name: string): string => name.trim().toLowerCase().replace(/\s+/g, "-");

export const generateInvoice = (name: string): string => {
    const formattedName = formatName(name).toUpperCase();
    const date = new Date().toISOString().slice(0, 10);
    const uniqueCode = nanoid6();

    return `${formattedName}-${date}-${uniqueCode}`;
};

export const generateNoAntrian = async (): Promise<string> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastTransactionToday = await prisma.transaksi.findFirst({
        where: { createdAt: { gte: today } },
        orderBy: { createdAt: "desc" },
        select: { noAntrian: true },
    });
    let nextNumber = 1;
    if (lastTransactionToday && lastTransactionToday.noAntrian) {
        nextNumber = parseInt(lastTransactionToday.noAntrian, 10) + 1;
    }
    return nextNumber.toString().padStart(3, "0");
};

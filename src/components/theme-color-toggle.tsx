"use client";

import React from "react";
import { useTheme } from "next-themes";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ThemeColors } from "@/types/theme-types";
import { useThemeContext } from "./theme-data-provider";

const availableThemeColors = [
    { name: "Slate", light: "bg-slate-900", dark: "bg-slate-700" },
    { name: "Zinc", light: "bg-zinc-900", dark: "bg-zinc-700" },
    { name: "Rose", light: "bg-rose-500", dark: "bg-rose-500" },
    { name: "Blue", light: "bg-blue-500", dark: "bg-blue-500" },
    { name: "Green", light: "bg-green-500", dark: "bg-green-500" },
    { name: "Orange", light: "bg-orange-500", dark: "bg-orange-500" },
    { name: "Violet", light: "bg-violet-500", dark: "bg-violet-500" },
    { name: "Yellow", light: "bg-yellow-500", dark: "bg-yellow-500" },
];

export function ThemeColorToggle() {
    const { themeColor, setThemeColor } = useThemeContext();
    const { theme } = useTheme();

    const createSelectItems = () =>
        availableThemeColors.map(({ name, light, dark }) => (
            <SelectItem key={name} value={name}>
                <div className="flex item-center space-x-3">
                    <div className={cn("rounded-full", "w-[20px]", "h-[20px]", theme === "light" ? light : dark)} />
                    <div className="text-sm">{name}</div>
                </div>
            </SelectItem>
        ));

    return (
        <Select onValueChange={(value) => setThemeColor(value as ThemeColors)} defaultValue={themeColor}>
            <SelectTrigger className="w-[180px] ring-offset-transparent focus:ring-transparent">
                <SelectValue placeholder="Select Color" />
            </SelectTrigger>
            <SelectContent className="border-muted">{createSelectItems()}</SelectContent>
        </Select>
    );
}

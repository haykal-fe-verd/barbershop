"use client";

import React from "react";
import Link from "next/link";
import { Facebook, Github, Globe, Instagram, Mail, MapPin, Phone } from "lucide-react";

import { Icons } from "@/components/icons";
import { Separator } from "@/components/ui/separator";

function Footer() {
    return (
        <footer className="border-t border-border bg-background">
            <div className="container mx-auto w-full p-4 py-6 lg:py-8">
                <div className="md:flex md:justify-between">
                    <div className="mb-6 md:mb-0">
                        <Link href="/" className="flex items-center gap-2">
                            <Icons.Logo className="h-8 w-auto dark:fill-white" />
                            <span className="self-center whitespace-nowrap text-xl font-semibold">Barbershop</span>
                        </Link>
                    </div>

                    <div className="flex flex-col justify-between gap-5 md:flex-row">
                        <div>
                            <h2 className="mb-6 text-sm font-semibold uppercase">Kontak Kami</h2>
                            <ul className="font-medium text-gray-500 dark:text-gray-400">
                                <li className="mb-4 flex items-center gap-2 hover:cursor-pointer hover:underline">
                                    <Phone className="h-4 w-4" />
                                    +62 888 8888 8888
                                </li>
                                <li className="mb-4 flex items-center gap-2 hover:cursor-pointer hover:underline">
                                    <Mail className="h-4 w-4" />
                                    barbershop@mail.com
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold uppercase">Ikuti Kami</h2>
                            <ul className="font-medium text-gray-500 dark:text-gray-400">
                                <li className="mb-4 flex items-center gap-2 hover:cursor-pointer hover:underline">
                                    <Github className="h-4 w-4" />
                                    <Link href="/">Github</Link>
                                </li>
                                <li className="mb-4 flex items-center gap-2 hover:cursor-pointer hover:underline">
                                    <Facebook className="h-4 w-4" />
                                    <Link href="/">Facebook</Link>
                                </li>
                                <li className="mb-4 flex items-center gap-2 hover:cursor-pointer hover:underline">
                                    <Instagram className="h-4 w-4" />
                                    <Link href="/">Instagram</Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold uppercase">Alamat Kami</h2>
                            <ul className="font-medium text-gray-500 dark:text-gray-400">
                                <li className="mb-4 flex items-center gap-2 hover:cursor-pointer hover:underline">
                                    <MapPin className="h-4 w-4" />
                                    <Link href="/">Jl. Politeknik Aceh, Pango Raya 23116</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <Separator className="my-6 lg:my-8" />
                <div className="sm:flex sm:items-center sm:justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400 sm:text-center">
                        © {new Date().getFullYear()}{" "}
                        <Link href="/" className="hover:underline">
                            Politeknik Aceh
                        </Link>
                        . All Rights Reserved.
                    </span>
                    <div className="mt-4 flex gap-5 sm:mt-0 sm:justify-center">
                        <Phone className="h-4 w-4 text-gray-500 hover:cursor-pointer hover:text-gray-900 dark:hover:text-white" />
                        <MapPin className="h-4 w-4 text-gray-500 hover:cursor-pointer hover:text-gray-900 dark:hover:text-white" />
                        <Globe className="h-4 w-4 text-gray-500 hover:cursor-pointer hover:text-gray-900 dark:hover:text-white" />
                        <Github className="h-4 w-4 text-gray-500 hover:cursor-pointer hover:text-gray-900 dark:hover:text-white" />
                        <Mail className="h-4 w-4 text-gray-500 hover:cursor-pointer hover:text-gray-900 dark:hover:text-white" />
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;

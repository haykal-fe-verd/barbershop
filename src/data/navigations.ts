interface GuestNavigationType {
    name: string;
    href: string;
}

export const guestNavigations: GuestNavigationType[] = [
    {
        name: "Home",
        href: "/",
    },
    {
        name: "barberman",
        href: "#barberman",
    },
    {
        name: "gallery",
        href: "#gallery",
    },
];

interface ProtectedNavigationType {
    name: string;
    href: string;
    roles: string[];
}

export const protectedNavigations: ProtectedNavigationType[] = [
    {
        name: "Dashboard",
        href: "/dashboard",
        roles: ["admin", "user"],
    },

    // admin
    {
        name: "Antrian",
        href: "/admin/antrian",
        roles: ["admin"],
    },
    {
        name: "Barberman",
        href: "/admin/barberman",
        roles: ["admin"],
    },
    {
        name: "Gallery",
        href: "/admin/gallery",
        roles: ["admin"],
    },
    {
        name: "Paket Barber",
        href: "/admin/paket",
        roles: ["admin"],
    },

    {
        name: "User",
        href: "/admin/user",
        roles: ["admin"],
    },
    {
        name: "Transaksi",
        href: "/admin/transaksi",
        roles: ["admin"],
    },
    {
        name: "Laporan",
        href: "/admin/laporan",
        roles: ["admin"],
    },

    // user
    {
        name: "Booking",
        href: "/booking",
        roles: ["user"],
    },
    {
        name: "Barberman",
        href: "/barberman",
        roles: ["user"],
    },
    {
        name: "Riwayat Transaksi",
        href: "/riwayat-transaksi",
        roles: ["user"],
    },
];

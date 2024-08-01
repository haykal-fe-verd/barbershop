import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const dataPaket = [
    {
        name: "Paket 1",
        price: 10000,
    },
    {
        name: "Paket 2",
        price: 20000,
    },
    {
        name: "Paket 3",
        price: 30000,
    },
    {
        name: "Paket 4",
        price: 40000,
    },
    {
        name: "Paket 5",
        price: 50000,
    },
];

const dataBarberman = [
    {
        name: "Barberman 1",
        status: "online",
        image: "https://t2n437l1di2bt6mq.public.blob.vercel-storage.com/avatar-Sy9gur1hCCG4QGobcr9EjLNTKQsjGA.jpeg",
    },
    {
        name: "Barberman 2",
        status: "online",
        image: "https://t2n437l1di2bt6mq.public.blob.vercel-storage.com/avatar-Sy9gur1hCCG4QGobcr9EjLNTKQsjGA.jpeg",
    },
    {
        name: "Barberman 3",
        status: "offline",
        image: "https://t2n437l1di2bt6mq.public.blob.vercel-storage.com/avatar-Sy9gur1hCCG4QGobcr9EjLNTKQsjGA.jpeg",
    },
];

const dataGallery = [
    {
        description: "Foto 1",
        image: "https://t2n437l1di2bt6mq.public.blob.vercel-storage.com/avatar-Sy9gur1hCCG4QGobcr9EjLNTKQsjGA.jpeg",
    },
    {
        description: "Foto 2",
        image: "https://t2n437l1di2bt6mq.public.blob.vercel-storage.com/avatar-Sy9gur1hCCG4QGobcr9EjLNTKQsjGA.jpeg",
    },
    {
        description: "Foto 3",
        image: "https://t2n437l1di2bt6mq.public.blob.vercel-storage.com/avatar-Sy9gur1hCCG4QGobcr9EjLNTKQsjGA.jpeg",
    },
];

async function main() {
    const passwordHash = await bcrypt.hash("password", 10);

    // admin
    const admin = await prisma.user.create({
        data: {
            name: "User Admin",
            email: "admin@admin.com",
            emailVerified: new Date(),
            password: passwordHash,
            role: "admin",
            phone: "08123456789",
        },
    });

    // user
    const user = await prisma.user.create({
        data: {
            name: "User User",
            email: "user@user.com",
            emailVerified: new Date(),
            password: passwordHash,
            role: "user",
            phone: "08123456789",
        },
    });

    // paket
    const paket = await prisma.paket.createMany({
        data: dataPaket,
    });

    // barberman
    await prisma.barberman.createMany({
        data: dataBarberman,
    });

    // gallery
    await prisma.gallery.createMany({
        data: dataGallery,
    });

    console.log({ admin, user, paket });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });

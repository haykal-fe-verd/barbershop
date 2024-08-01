import { z } from "zod";

const MAX_FILE_SIZE = 1024 * 1024 * 4;
const ACCEPTED_FILE_TYPES = "image/";

export const loginSchema = z.object({
    email: z.string({ required_error: "Email wajib diisi" }).email("Format email yang anda masukkan salah"),
    password: z
        .string({ required_error: "Password wajib diisi" })
        .min(8, "Password harus lebih dari 8 karakter")
        .max(32, "Password harus kurang dari 32 karakter"),
});

export const registerSchema = z
    .object({
        name: z.string({ required_error: "Nama wajib diisi" }).min(1, "Nama wajib diisi"),
        email: z.string({ required_error: "Email wajib diisi" }).email("Format email yang anda masukkan salah"),
        password: z
            .string({ required_error: "Password wajib diisi" })
            .min(8, "Password harus lebih dari 8 karakter")
            .max(32, "Password harus kurang dari 32 karakter"),
        passwordConfirmation: z
            .string({ required_error: "Konfirmasi password wajib diisi" })
            .min(8, "Konfirmasi password harus lebih dari 8 karakter")
            .max(32, "Konfirmasi password harus kurang dari 32 karakter"),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        message: "Konfirmasi password tidak cocok",
        path: ["passwordConfirmation"],
    });

export const forgotPasswordSchema = z.object({
    email: z.string({ required_error: "Email wajib diisi" }).email("Format email yang anda masukkan salah"),
});

export const newPasswordSchema = z
    .object({
        password: z
            .string({ required_error: "Password wajib diisi" })
            .min(8, "Password harus lebih dari 8 karakter")
            .max(32, "Password harus kurang dari 32 karakter"),
        passwordConfirmation: z
            .string({ required_error: "Konfirmasi password wajib diisi" })
            .min(8, "Konfirmasi password harus lebih dari 8 karakter")
            .max(32, "Konfirmasi password harus kurang dari 32 karakter"),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        message: "Konfirmasi password tidak cocok",
        path: ["passwordConfirmation"],
    });

export const updateProfileSchema = z
    .object({
        name: z.string().min(1, { message: "Nama wajib diisi" }),
        email: z.string().email("Format email yang anda masukkan salah"),
        phone: z.string().max(15, "Nomor telepon maksimal 15 karakter"),
        image: z
            .instanceof(File)
            .refine((file) => file.size === 0 || file.type.startsWith(ACCEPTED_FILE_TYPES), {
                message: "Tipe file tidak valid, hanya JPG dan PNG yang diizinkan",
            })
            .refine((file) => file.size < MAX_FILE_SIZE, { message: "Ukuran file terlalu besar (maksimal 4MB)" })
            .optional(),
        password: z
            .string()
            .refine((val) => !val || val.length >= 8, "Password harus lebih dari 8 karakter")
            .refine((val) => !val || val.length <= 32, "Password harus kurang dari 32 karakter")
            .optional(),
        passwordConfirmation: z.string().optional(),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        message: "Konfirmasi password tidak cocok",
        path: ["passwordConfirmation"],
    });

export const barbermanSchema = z.object({
    name: z.string().min(1, { message: "Nama barberman harus diisi" }),
    image: z
        .instanceof(File)
        .refine((file) => file.size > 0, { message: "Harap pilih gambar" })
        .refine((file) => file.size === 0 || file.type.startsWith(ACCEPTED_FILE_TYPES), {
            message: "Tipe file tidak valid, hanya JPG dan PNG yang diizinkan",
        })
        .refine((file) => file.size < MAX_FILE_SIZE, { message: "Ukuran file terlalu besar (maksimal 4MB)" }),
    status: z.string().min(1, { message: "Status wajib diisi" }),
});

export const updateBarbermanSchema = z.object({
    name: z.string().min(1, { message: "Nama barberman harus diisi" }),
    image: z
        .instanceof(File)
        .refine((file) => file.size === 0 || file.type.startsWith(ACCEPTED_FILE_TYPES), {
            message: "Tipe file tidak valid, hanya JPG dan PNG yang diizinkan",
        })
        .refine((file) => file.size < MAX_FILE_SIZE, { message: "Ukuran file terlalu besar (maksimal 4MB)" })
        .optional(),
    status: z.string().min(1, { message: "Status wajib diisi" }),
});

export const gallerySchema = z.object({
    description: z.string().min(1, { message: "Deskripsi gambar harus diisi" }),
    image: z
        .instanceof(File)
        .refine((file) => file.size > 0, { message: "Harap pilih gambar" })
        .refine((file) => file.size === 0 || file.type.startsWith(ACCEPTED_FILE_TYPES), {
            message: "Tipe file tidak valid, hanya JPG dan PNG yang diizinkan",
        })
        .refine((file) => file.size < MAX_FILE_SIZE, { message: "Ukuran file terlalu besar (maksimal 4MB)" }),
});

export const updateGallerySchema = z.object({
    description: z.string().min(1, { message: "Deskripsi gambar harus diisi" }),
    image: z
        .instanceof(File)
        .refine((file) => file.size === 0 || file.type.startsWith(ACCEPTED_FILE_TYPES), {
            message: "Tipe file tidak valid, hanya JPG dan PNG yang diizinkan",
        })
        .refine((file) => file.size < MAX_FILE_SIZE, { message: "Ukuran file terlalu besar (maksimal 4MB)" })
        .optional(),
});

export const paketSchema = z.object({
    name: z.string().min(1, { message: "Nama paket harus diisi" }),
    price: z.coerce.number({ required_error: "Harga paket harus diisi" }),
});

export const userSchema = z
    .object({
        name: z
            .string({ required_error: "Nama harus diisi" })
            .min(1, { message: "Nama harus diisi" })
            .max(60, { message: "Nama harus maksimal 60 karakter" }),
        email: z.string({ required_error: "Email wajib diisi" }).email("Format email yang anda masukkan salah"),
        phone: z
            .string({ required_error: "Nomor telepon wajib diisi" })
            .min(1, "Nomor telepon harus diisi")
            .max(15, "Nomor telepon maksimal 15 karakter"),
        role: z.string({ required_error: "Role wajib diisi" }),
        image: z
            .instanceof(File)
            .refine((file) => file.size === 0 || file.type.startsWith(ACCEPTED_FILE_TYPES), {
                message: "Tipe file tidak valid, hanya JPG dan PNG yang diizinkan",
            })
            .refine((file) => file.size < MAX_FILE_SIZE, { message: "Ukuran file terlalu besar (maksimal 4MB)" })
            .optional(),
        password: z
            .string({ required_error: "Password wajib diisi" })
            .min(8, "Password harus lebih dari 8 karakter")
            .max(32, "Password harus kurang dari 32 karakter"),
        passwordConfirmation: z
            .string({ required_error: "Konfirmasi password wajib diisi" })
            .min(8, "Konfirmasi password harus lebih dari 8 karakter")
            .max(32, "Konfirmasi password harus kurang dari 32 karakter"),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        message: "Konfirmasi password tidak cocok",
        path: ["passwordConfirmation"],
    });

export const updateUserSchema = z
    .object({
        name: z.string({ required_error: "Nama harus diisi" }).max(60, { message: "Nama harus maksimal 60 karakter" }),
        email: z.string({ required_error: "Email wajib diisi" }).email("Format email yang anda masukkan salah"),
        phone: z.string({ required_error: "Nomor telepon wajib diisi" }).max(15, "Nomor telepon maksimal 15 karakter"),
        role: z.string({ required_error: "Role wajib diisi" }),
        image: z
            .instanceof(File)
            .refine((file) => file.size === 0 || file.type.startsWith(ACCEPTED_FILE_TYPES), {
                message: "Tipe file tidak valid, hanya JPG dan PNG yang diizinkan",
            })
            .refine((file) => file.size < MAX_FILE_SIZE, { message: "Ukuran file terlalu besar (maksimal 4MB)" })
            .optional(),
        password: z
            .string()
            .refine((val) => !val || val.length >= 8, "Password harus lebih dari 8 karakter")
            .refine((val) => !val || val.length <= 32, "Password harus kurang dari 32 karakter")
            .optional(),
        passwordConfirmation: z.string().optional(),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        message: "Konfirmasi password tidak cocok",
        path: ["passwordConfirmation"],
    });

export const transaksiSchema = z.object({
    barberman: z.string().min(1, { message: "Barberman wajib diisi" }),
});

//   image: z
//         .unknown()
//         .transform((value) => value as FileList)
//         .refine((files) => files?.length > 0, { message: "Harap pilih gambar" })
//         .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, { message: "Ukuran file terlalu besar (maksimal 3MB)" })
//         .refine(
//             (files) => {
//                 const file = files?.[0];
//                 return file?.type.startsWith(ACCEPTED_FILE_TYPES);
//             },
//             { message: "Tipe file tidak valid, hanya JPG dan PNG yang diizinkan" },
//         ),

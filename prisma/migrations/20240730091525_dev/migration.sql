-- CreateTable
CREATE TABLE "tb_user" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "email_verified" TIMESTAMP(3),
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "phone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_account" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_session" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_verification_token" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "tb_password_reset_token" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_password_reset_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_barberman" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "status" TEXT DEFAULT 'online',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_barberman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_gallery" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_gallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_paket" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_paket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_transaksi" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "paket_id" TEXT NOT NULL,
    "namaBarberman" TEXT,
    "invoice" TEXT NOT NULL,
    "snap_token" TEXT,
    "snapUrl" TEXT,
    "via" TEXT,
    "total" INTEGER,
    "noAntrian" TEXT,
    "status" TEXT DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_transaksi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_email_key" ON "tb_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tb_account_provider_provider_account_id_key" ON "tb_account"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "tb_session_session_token_key" ON "tb_session"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "tb_verification_token_identifier_key" ON "tb_verification_token"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "tb_verification_token_token_key" ON "tb_verification_token"("token");

-- CreateIndex
CREATE UNIQUE INDEX "tb_password_reset_token_identifier_key" ON "tb_password_reset_token"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "tb_password_reset_token_token_key" ON "tb_password_reset_token"("token");

-- CreateIndex
CREATE UNIQUE INDEX "tb_transaksi_invoice_key" ON "tb_transaksi"("invoice");

-- AddForeignKey
ALTER TABLE "tb_account" ADD CONSTRAINT "tb_account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tb_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_session" ADD CONSTRAINT "tb_session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tb_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_transaksi" ADD CONSTRAINT "tb_transaksi_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tb_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_transaksi" ADD CONSTRAINT "tb_transaksi_paket_id_fkey" FOREIGN KEY ("paket_id") REFERENCES "tb_paket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

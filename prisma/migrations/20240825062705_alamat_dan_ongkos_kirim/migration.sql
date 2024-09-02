-- AlterTable
ALTER TABLE "Checkout" ADD COLUMN     "alamatPengirimanId" TEXT,
ADD COLUMN     "jasaKirimId" TEXT;

-- CreateTable
CREATE TABLE "AlamatPengiriman" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "kota" TEXT NOT NULL,
    "provinsi" TEXT NOT NULL,
    "kodePos" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AlamatPengiriman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JasaKirim" (
    "id" TEXT NOT NULL,
    "namaJasa" TEXT NOT NULL,
    "ongkosKirim" INTEGER NOT NULL,

    CONSTRAINT "JasaKirim_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AlamatPengiriman" ADD CONSTRAINT "AlamatPengiriman_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkout" ADD CONSTRAINT "Checkout_alamatPengirimanId_fkey" FOREIGN KEY ("alamatPengirimanId") REFERENCES "AlamatPengiriman"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkout" ADD CONSTRAINT "Checkout_jasaKirimId_fkey" FOREIGN KEY ("jasaKirimId") REFERENCES "JasaKirim"("id") ON DELETE SET NULL ON UPDATE CASCADE;

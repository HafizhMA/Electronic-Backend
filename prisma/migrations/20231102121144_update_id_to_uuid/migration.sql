-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "namaBarang" TEXT NOT NULL,
    "deskripsiBarang" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "hargaBarang" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

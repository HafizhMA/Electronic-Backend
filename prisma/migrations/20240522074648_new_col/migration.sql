/*
  Warnings:

  - Added the required column `diskon` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kategori` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "diskon" INTEGER NOT NULL,
ADD COLUMN     "kategori" TEXT NOT NULL;

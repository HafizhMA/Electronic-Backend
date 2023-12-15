/*
  Warnings:

  - Added the required column `berat` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `capacity` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `color` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dimensi` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `features` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `powerConsumption` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "berat" TEXT NOT NULL,
ADD COLUMN     "capacity" TEXT NOT NULL,
ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "dimensi" TEXT NOT NULL,
ADD COLUMN     "features" TEXT NOT NULL,
ADD COLUMN     "powerConsumption" TEXT NOT NULL,
ADD COLUMN     "size" TEXT NOT NULL;

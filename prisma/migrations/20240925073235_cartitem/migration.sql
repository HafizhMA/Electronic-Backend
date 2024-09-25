/*
  Warnings:

  - You are about to drop the column `jasaKirimId` on the `Checkout` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Checkout" DROP CONSTRAINT "Checkout_jasaKirimId_fkey";

-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "jasaKirimId" TEXT;

-- AlterTable
ALTER TABLE "Checkout" DROP COLUMN "jasaKirimId";

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_jasaKirimId_fkey" FOREIGN KEY ("jasaKirimId") REFERENCES "JasaKirim"("id") ON DELETE SET NULL ON UPDATE CASCADE;

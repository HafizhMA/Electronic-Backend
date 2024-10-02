-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_jasaKirimId_fkey";

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_jasaKirimId_fkey" FOREIGN KEY ("jasaKirimId") REFERENCES "JasaKirim"("id") ON DELETE CASCADE ON UPDATE CASCADE;

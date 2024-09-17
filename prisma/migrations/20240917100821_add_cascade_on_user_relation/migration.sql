-- DropForeignKey
ALTER TABLE "Checkout" DROP CONSTRAINT "Checkout_userId_fkey";

-- AddForeignKey
ALTER TABLE "Checkout" ADD CONSTRAINT "Checkout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

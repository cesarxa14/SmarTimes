/*
  Warnings:

  - The primary key for the `seller_manager` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `bank_id` to the `seller_manager` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "seller_manager" DROP CONSTRAINT "seller_manager_pkey",
ADD COLUMN     "bank_id" INTEGER NOT NULL,
ADD CONSTRAINT "seller_manager_pkey" PRIMARY KEY ("seller_id", "manager_id", "bank_id");

-- AddForeignKey
ALTER TABLE "seller_manager" ADD CONSTRAINT "bank_id" FOREIGN KEY ("bank_id") REFERENCES "bank"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

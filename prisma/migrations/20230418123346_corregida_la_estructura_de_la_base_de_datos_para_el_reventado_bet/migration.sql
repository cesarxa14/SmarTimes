/*
  Warnings:

  - You are about to drop the column `reventado_bet_id` on the `bet_number` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[bet_number_id]` on the table `reventado_bet` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "bet_number" DROP CONSTRAINT "reventado_bet_id";

-- AlterTable
ALTER TABLE "bet_number" DROP COLUMN "reventado_bet_id";

-- CreateIndex
CREATE UNIQUE INDEX "reventado_bet_bet_number_id_key" ON "reventado_bet"("bet_number_id");

-- AddForeignKey
ALTER TABLE "reventado_bet" ADD CONSTRAINT "reventado_bet_bet_number_id_fkey" FOREIGN KEY ("bet_number_id") REFERENCES "bet_number"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

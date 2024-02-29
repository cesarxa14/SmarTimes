/*
  Warnings:

  - You are about to drop the `bet_ball` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `reventado_bet_id` to the `bet_number` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bet_ball" DROP CONSTRAINT "bet_number_id";

-- AlterTable
ALTER TABLE "bet_number" ADD COLUMN     "reventado_bet_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "bet_ball";

-- CreateTable
CREATE TABLE "reventado_bet" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "bet_number_id" INTEGER NOT NULL,

    CONSTRAINT "reventado_bet_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bet_number" ADD CONSTRAINT "reventado_bet_id" FOREIGN KEY ("reventado_bet_id") REFERENCES "reventado_bet"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

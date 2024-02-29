/*
  Warnings:

  - You are about to drop the `bet_number_type` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "bet_number" DROP CONSTRAINT "bet_number_type_id";

-- DropTable
DROP TABLE "bet_number_type";

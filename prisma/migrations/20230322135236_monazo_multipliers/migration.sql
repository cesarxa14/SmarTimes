/*
  Warnings:

  - Added the required column `main_multiplier` to the `lottery_monazo_type` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondary_multiplier` to the `lottery_monazo_type` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "lottery_monazo_type" ADD COLUMN     "main_multiplier" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "secondary_multiplier" DOUBLE PRECISION NOT NULL;

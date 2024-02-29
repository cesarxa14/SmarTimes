/*
  Warnings:

  - You are about to drop the column `ball_type_id` on the `bet_ball` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "bet_ball" DROP CONSTRAINT "ball_type_id";

-- AlterTable
ALTER TABLE "bet_ball" DROP COLUMN "ball_type_id";

-- AlterTable
ALTER TABLE "reventado_lottery_ball_type" ALTER COLUMN "multiplier" SET DEFAULT 0;

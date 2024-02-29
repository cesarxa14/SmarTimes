/*
  Warnings:

  - You are about to drop the column `loterry_time` on the `lottery` table. All the data in the column will be lost.
  - Added the required column `lottery_time` to the `lottery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "lottery" DROP COLUMN "loterry_time",
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lottery_time" TIMESTAMPTZ(6) NOT NULL;

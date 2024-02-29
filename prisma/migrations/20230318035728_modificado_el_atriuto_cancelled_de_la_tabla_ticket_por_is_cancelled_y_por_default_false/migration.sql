/*
  Warnings:

  - You are about to drop the column `cancelled` on the `ticket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ticket" DROP COLUMN "cancelled",
ADD COLUMN     "is_cancelled" BOOLEAN NOT NULL DEFAULT false;

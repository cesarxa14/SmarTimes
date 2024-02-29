/*
  Warnings:

  - You are about to drop the column `seller_id` on the `seller_restricted_numbers` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "seller_restricted_numbers" DROP CONSTRAINT "seller_restricted_numbers_seller_id_fkey";

-- AlterTable
ALTER TABLE "plan" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "seller_restricted_numbers" DROP COLUMN "seller_id";

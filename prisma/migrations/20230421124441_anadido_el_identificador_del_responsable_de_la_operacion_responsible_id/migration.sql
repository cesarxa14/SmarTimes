/*
  Warnings:

  - Added the required column `responsible_id` to the `operation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "operation" ADD COLUMN     "responsible_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "operation" ADD CONSTRAINT "responsible_id" FOREIGN KEY ("responsible_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

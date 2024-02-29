/*
  Warnings:

  - You are about to drop the column `owner_uid` on the `bank` table. All the data in the column will be lost.
  - The primary key for the `bank_seller` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `seller_uid` on the `bank_seller` table. All the data in the column will be lost.
  - You are about to drop the column `owner_uid` on the `license` table. All the data in the column will be lost.
  - You are about to drop the column `seller_uid` on the `lottery_ticket` table. All the data in the column will be lost.
  - You are about to drop the column `seller_uid` on the `operation` table. All the data in the column will be lost.
  - The primary key for the `seller` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `uid` on the `seller` table. All the data in the column will be lost.
  - The primary key for the `seller_lottery` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `seller_uid` on the `seller_lottery` table. All the data in the column will be lost.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[uid]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `owner_id` to the `bank` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seller_id` to the `bank_seller` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_id` to the `license` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seller_id` to the `lottery_ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seller_id` to the `operation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `seller` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seller_id` to the `seller_lottery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_id` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bank" DROP CONSTRAINT "owner_uid_fk";

-- DropForeignKey
ALTER TABLE "bank_seller" DROP CONSTRAINT "seller_uid";

-- DropForeignKey
ALTER TABLE "license" DROP CONSTRAINT "owner_uid";

-- DropForeignKey
ALTER TABLE "lottery_ticket" DROP CONSTRAINT "seller_uid";

-- DropForeignKey
ALTER TABLE "operation" DROP CONSTRAINT "seller_uid";

-- DropForeignKey
ALTER TABLE "seller" DROP CONSTRAINT "uid";

-- DropForeignKey
ALTER TABLE "seller_lottery" DROP CONSTRAINT "seller_uid";

-- AlterTable
ALTER TABLE "bank" DROP COLUMN "owner_uid",
ADD COLUMN     "owner_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "bank_seller" DROP CONSTRAINT "bank_seller_pkey",
DROP COLUMN "seller_uid",
ADD COLUMN     "seller_id" INTEGER NOT NULL,
ADD CONSTRAINT "bank_seller_pkey" PRIMARY KEY ("bank_id", "seller_id");

-- AlterTable
ALTER TABLE "license" DROP COLUMN "owner_uid",
ADD COLUMN     "owner_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "lottery_ticket" DROP COLUMN "seller_uid",
ADD COLUMN     "seller_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "operation" DROP COLUMN "seller_uid",
ADD COLUMN     "seller_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "seller" DROP CONSTRAINT "seller_pkey",
DROP COLUMN "uid",
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD CONSTRAINT "seller_pkey" PRIMARY KEY ("user_id");

-- AlterTable
ALTER TABLE "seller_lottery" DROP CONSTRAINT "seller_lottery_pkey",
DROP COLUMN "seller_uid",
ADD COLUMN     "seller_id" INTEGER NOT NULL,
ADD CONSTRAINT "seller_lottery_pkey" PRIMARY KEY ("seller_id", "lottery_id");

-- AlterTable
ALTER TABLE "user" DROP CONSTRAINT "user_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "role_id" INTEGER NOT NULL,
ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_uid_key" ON "user"("uid");

-- AddForeignKey
ALTER TABLE "bank" ADD CONSTRAINT "owner_uid_fk" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "bank_seller" ADD CONSTRAINT "seller_id" FOREIGN KEY ("seller_id") REFERENCES "seller"("user_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "license" ADD CONSTRAINT "owner_id" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "lottery_ticket" ADD CONSTRAINT "seller_uid" FOREIGN KEY ("seller_id") REFERENCES "seller"("user_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "operation" ADD CONSTRAINT "seller_id" FOREIGN KEY ("seller_id") REFERENCES "seller"("user_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "seller" ADD CONSTRAINT "user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "seller_lottery" ADD CONSTRAINT "seller_id" FOREIGN KEY ("seller_id") REFERENCES "seller"("user_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "role_id" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

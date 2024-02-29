/*
  Warnings:

  - You are about to drop the column `owner_id` on the `license` table. All the data in the column will be lost.
  - Added the required column `expiration_date` to the `license` table without a default value. This is not possible if the table is not empty.
  - Added the required column `administrators` to the `plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monthly_price` to the `plan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "license" DROP CONSTRAINT "owner_id";

-- AlterTable
ALTER TABLE "license" DROP COLUMN "owner_id",
ADD COLUMN     "creation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expiration_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" INTEGER,
ALTER COLUMN "active" SET DEFAULT true;

-- AlterTable
ALTER TABLE "plan" ADD COLUMN     "administrators" INTEGER NOT NULL,
ADD COLUMN     "allowed_banks" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "monthly_price" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "license_update" (
    "id" SERIAL NOT NULL,
    "operation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiration_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responsibleId" INTEGER,
    "license_id" INTEGER NOT NULL,

    CONSTRAINT "license_update_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "license_update" ADD CONSTRAINT "license_update_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "license_update" ADD CONSTRAINT "license_update_license_id_fkey" FOREIGN KEY ("license_id") REFERENCES "license"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "license" ADD CONSTRAINT "license_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

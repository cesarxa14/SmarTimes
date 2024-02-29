-- AlterTable
ALTER TABLE "lottery_programming" ADD COLUMN     "is_computed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "seller" ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "debts" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ticket" ADD COLUMN     "is_computed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "billing_statement" (
    "id" SERIAL NOT NULL,
    "billing_date" TIMESTAMPTZ(6) NOT NULL,
    "lottery_programming_id" INTEGER NOT NULL,

    CONSTRAINT "billing_statement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seller_billing_statement" (
    "seller_id" INTEGER NOT NULL,
    "billing_statement_id" INTEGER NOT NULL,
    "quantity_sold" DOUBLE PRECISION NOT NULL,
    "commission" DOUBLE PRECISION NOT NULL,
    "prize_to_be_paid" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "seller_billing_statement_pkey" PRIMARY KEY ("seller_id","billing_statement_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "billing_statement_lottery_programming_id_key" ON "billing_statement"("lottery_programming_id");

-- AddForeignKey
ALTER TABLE "billing_statement" ADD CONSTRAINT "lottery_programming_id" FOREIGN KEY ("lottery_programming_id") REFERENCES "lottery_programming"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "seller_billing_statement" ADD CONSTRAINT "seller_id" FOREIGN KEY ("seller_id") REFERENCES "seller"("user_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "seller_billing_statement" ADD CONSTRAINT "billing_statement_id" FOREIGN KEY ("billing_statement_id") REFERENCES "billing_statement"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

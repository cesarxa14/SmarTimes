-- CreateTable
CREATE TABLE "restricted_number" (
    "id" SERIAL NOT NULL,
    "lottery_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "restricted_number_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seller_restricted_numbers" (
    "id" SERIAL NOT NULL,
    "seller_id" INTEGER NOT NULL,
    "lottery_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "seller_restricted_numbers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programming_restricted_numbers" (
    "id" SERIAL NOT NULL,
    "programming_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "programming_restricted_numbers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seller_programming_restricted_numbers" (
    "id" SERIAL NOT NULL,
    "seller_id" INTEGER NOT NULL,
    "programming_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "seller_programming_restricted_numbers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "restricted_number" ADD CONSTRAINT "lottery_id" FOREIGN KEY ("lottery_id") REFERENCES "lottery"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "seller_restricted_numbers" ADD CONSTRAINT "seller_restricted_numbers_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "seller"("user_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "seller_restricted_numbers" ADD CONSTRAINT "lottery_id" FOREIGN KEY ("lottery_id") REFERENCES "lottery"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "programming_restricted_numbers" ADD CONSTRAINT "programming_id" FOREIGN KEY ("programming_id") REFERENCES "lottery_programming"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "seller_programming_restricted_numbers" ADD CONSTRAINT "seller_programming_restricted_numbers_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "seller"("user_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "seller_programming_restricted_numbers" ADD CONSTRAINT "programming_id" FOREIGN KEY ("programming_id") REFERENCES "lottery_programming"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

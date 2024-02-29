-- CreateTable
CREATE TABLE "manager_commission" (
    "manager_id" INTEGER NOT NULL,
    "lottery_id" INTEGER NOT NULL,
    "commission" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "manager_commission_pkey" PRIMARY KEY ("manager_id","lottery_id")
);

-- CreateTable
CREATE TABLE "seller_commision" (
    "seller_id" INTEGER NOT NULL,
    "lottery_id" INTEGER NOT NULL,
    "commission" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "seller_commision_pkey" PRIMARY KEY ("seller_id","lottery_id")
);

-- AddForeignKey
ALTER TABLE "manager_commission" ADD CONSTRAINT "lottery_id" FOREIGN KEY ("lottery_id") REFERENCES "lottery"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "manager_commission" ADD CONSTRAINT "manager_id" FOREIGN KEY ("manager_id") REFERENCES "manager"("user_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "seller_commision" ADD CONSTRAINT "seller_id" FOREIGN KEY ("seller_id") REFERENCES "seller"("user_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "seller_commision" ADD CONSTRAINT "lottery_id" FOREIGN KEY ("lottery_id") REFERENCES "lottery"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- CreateTable
CREATE TABLE "seller_manager" (
    "seller_id" INTEGER NOT NULL,
    "manager_id" INTEGER NOT NULL,

    CONSTRAINT "seller_manager_pkey" PRIMARY KEY ("seller_id","manager_id")
);

-- AddForeignKey
ALTER TABLE "seller_manager" ADD CONSTRAINT "seller_id" FOREIGN KEY ("seller_id") REFERENCES "seller"("user_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "seller_manager" ADD CONSTRAINT "manager_id" FOREIGN KEY ("manager_id") REFERENCES "manager"("user_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

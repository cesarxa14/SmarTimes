-- CreateTable
CREATE TABLE "bank_manager" (
    "bank_id" INTEGER NOT NULL,
    "manager_id" INTEGER NOT NULL,

    CONSTRAINT "bank_manager_pkey" PRIMARY KEY ("bank_id","manager_id")
);

-- CreateTable
CREATE TABLE "manager" (
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "manager_pkey" PRIMARY KEY ("user_id")
);

-- AddForeignKey
ALTER TABLE "bank_manager" ADD CONSTRAINT "bank_id" FOREIGN KEY ("bank_id") REFERENCES "bank"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "bank_manager" ADD CONSTRAINT "manager_id" FOREIGN KEY ("manager_id") REFERENCES "manager"("user_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "manager" ADD CONSTRAINT "user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

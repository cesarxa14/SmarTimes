-- CreateTable
CREATE TABLE "bank" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "owner_uid" TEXT NOT NULL,

    CONSTRAINT "bank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_seller" (
    "bank_id" INTEGER NOT NULL,
    "seller_uid" TEXT NOT NULL,

    CONSTRAINT "bank_seller_pkey" PRIMARY KEY ("bank_id","seller_uid")
);

-- CreateTable
CREATE TABLE "license" (
    "id" SERIAL NOT NULL,
    "owner_uid" TEXT NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL,

    CONSTRAINT "license_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lottery" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "closing_time" TIMESTAMPTZ(6) NOT NULL,
    "loterry_time" TIMESTAMPTZ(6) NOT NULL,
    "lottery_type_id" INTEGER NOT NULL,
    "bank_id" INTEGER NOT NULL,

    CONSTRAINT "lottery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lottery_programming" (
    "id" SERIAL NOT NULL,
    "lottery_id" INTEGER NOT NULL,
    "date" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "lottery_programming_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lottery_ticket" (
    "id" SERIAL NOT NULL,
    "seller_uid" TEXT NOT NULL,
    "lottery_programming_id" INTEGER NOT NULL,
    "buying_date" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "lottery_ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lottery_type" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "lotery_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operation" (
    "id" INTEGER NOT NULL,
    "bank_id" INTEGER NOT NULL,
    "seller_uid" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "operation_type_id" INTEGER NOT NULL,

    CONSTRAINT "operation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operation_type" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "operation_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permission" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "seller_count" INTEGER NOT NULL,

    CONSTRAINT "plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permission" (
    "role_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,

    CONSTRAINT "role_permission_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateTable
CREATE TABLE "seller" (
    "uid" TEXT NOT NULL,

    CONSTRAINT "seller_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "seller_lottery" (
    "seller_uid" TEXT NOT NULL,
    "lottery_id" INTEGER NOT NULL,

    CONSTRAINT "seller_lottery_pkey" PRIMARY KEY ("seller_uid","lottery_id")
);

-- CreateTable
CREATE TABLE "user" (
    "uid" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "error" (
    "id" BIGSERIAL NOT NULL,
    "message" TEXT,
    "stack" TEXT,
    "url" TEXT,
    "path" TEXT,
    "error_status" INTEGER,
    "request_body" TEXT,
    "time" TIMESTAMPTZ(6),

    CONSTRAINT "error_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "error_status" (
    "id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "error_status_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bank" ADD CONSTRAINT "owner_uid_fk" FOREIGN KEY ("owner_uid") REFERENCES "user"("uid") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "bank_seller" ADD CONSTRAINT "bank_id" FOREIGN KEY ("bank_id") REFERENCES "bank"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "bank_seller" ADD CONSTRAINT "seller_uid" FOREIGN KEY ("seller_uid") REFERENCES "seller"("uid") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "license" ADD CONSTRAINT "owner_uid" FOREIGN KEY ("owner_uid") REFERENCES "user"("uid") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "license" ADD CONSTRAINT "plan_id" FOREIGN KEY ("plan_id") REFERENCES "plan"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "lottery" ADD CONSTRAINT "bank_id" FOREIGN KEY ("bank_id") REFERENCES "bank"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "lottery" ADD CONSTRAINT "lottery_type_id" FOREIGN KEY ("lottery_type_id") REFERENCES "lottery_type"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "lottery_programming" ADD CONSTRAINT "lottery_id" FOREIGN KEY ("lottery_id") REFERENCES "lottery"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "lottery_ticket" ADD CONSTRAINT "lottery_programming_id" FOREIGN KEY ("lottery_programming_id") REFERENCES "lottery_programming"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "lottery_ticket" ADD CONSTRAINT "seller_uid" FOREIGN KEY ("seller_uid") REFERENCES "seller"("uid") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "operation" ADD CONSTRAINT "bank_id" FOREIGN KEY ("bank_id") REFERENCES "bank"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "operation" ADD CONSTRAINT "operation_type_id" FOREIGN KEY ("operation_type_id") REFERENCES "operation_type"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "operation" ADD CONSTRAINT "seller_uid" FOREIGN KEY ("seller_uid") REFERENCES "seller"("uid") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "permission_id" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_id" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "seller" ADD CONSTRAINT "uid" FOREIGN KEY ("uid") REFERENCES "user"("uid") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "seller_lottery" ADD CONSTRAINT "lottery_id" FOREIGN KEY ("lottery_id") REFERENCES "lottery"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "seller_lottery" ADD CONSTRAINT "seller_uid" FOREIGN KEY ("seller_uid") REFERENCES "seller"("uid") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "error" ADD CONSTRAINT "status" FOREIGN KEY ("error_status") REFERENCES "error_status"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

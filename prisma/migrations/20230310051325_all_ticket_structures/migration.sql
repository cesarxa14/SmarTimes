-- AlterTable
CREATE SEQUENCE operation_id_seq;
ALTER TABLE "operation" ALTER COLUMN "id" SET DEFAULT nextval('operation_id_seq');
ALTER SEQUENCE operation_id_seq OWNED BY "operation"."id";

-- CreateTable
CREATE TABLE "ball_type" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "ball_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bet_ball" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "bet_number_id" INTEGER NOT NULL,
    "ball_type_id" INTEGER NOT NULL,

    CONSTRAINT "bet_ball_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bet_number" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "ticket_id" INTEGER NOT NULL,
    "bet_number_type_id" INTEGER NOT NULL,

    CONSTRAINT "bet_number_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bet_number_type" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "bet_number_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lottery_monazo_type" (
    "lottery_id" INTEGER NOT NULL,
    "monazo_type_id" INTEGER NOT NULL,

    CONSTRAINT "lottery_monazo_type_pkey" PRIMARY KEY ("lottery_id","monazo_type_id")
);

-- CreateTable
CREATE TABLE "lottery_prize" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "multiplier" DOUBLE PRECISION NOT NULL,
    "lottery_id" INTEGER NOT NULL,

    CONSTRAINT "lottery_prize_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lottery_winner_number" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "lottery_programming_id" INTEGER NOT NULL,
    "lottery_prize_id" INTEGER NOT NULL,

    CONSTRAINT "lottery_winner_number_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monazo_bet_number" (
    "id" SERIAL NOT NULL,
    "first_number" INTEGER NOT NULL,
    "second_number" INTEGER NOT NULL,
    "third_number" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "ticket_id" INTEGER NOT NULL,
    "monazo_type_id" INTEGER NOT NULL,

    CONSTRAINT "monazo_bet_number_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monazo_lottery_winner_number" (
    "id" SERIAL NOT NULL,
    "first_number" INTEGER NOT NULL,
    "second_number" INTEGER NOT NULL,
    "third_number" INTEGER NOT NULL,
    "lottery_programming_id" INTEGER NOT NULL,

    CONSTRAINT "monazo_lottery_winner_number_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monazo_type" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "monazo_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parley_bet_number" (
    "id" SERIAL NOT NULL,
    "first_number" INTEGER NOT NULL,
    "second_number" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "ticket_id" INTEGER NOT NULL,

    CONSTRAINT "parley_bet_number_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parley_lottery" (
    "lottery_id" INTEGER NOT NULL,
    "multiplier" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "parley_lottery_pkey" PRIMARY KEY ("lottery_id")
);

-- CreateTable
CREATE TABLE "parley_lottery_winner_number" (
    "id" SERIAL NOT NULL,
    "first_number" INTEGER NOT NULL,
    "second_number" INTEGER NOT NULL,
    "third_number" INTEGER NOT NULL,
    "lottery_programming_id" INTEGER NOT NULL,

    CONSTRAINT "parley_lottery_winner_number_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reventado_lottery" (
    "lottery_id" INTEGER NOT NULL,
    "multiplier" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "reventado_lottery_pkey" PRIMARY KEY ("lottery_id")
);

-- CreateTable
CREATE TABLE "reventado_lottery_ball_type" (
    "reventado_lottery_id" INTEGER NOT NULL,
    "ball_type_id" INTEGER NOT NULL,
    "multiplier" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "reventado_lottery_ball_type_pkey" PRIMARY KEY ("reventado_lottery_id","ball_type_id")
);

-- CreateTable
CREATE TABLE "reventado_lottery_winner_number" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "lottery_programming_id" INTEGER NOT NULL,
    "ball_type_id" INTEGER NOT NULL,

    CONSTRAINT "reventado_lottery_winner_number_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket" (
    "id" SERIAL NOT NULL,
    "buyer_name" TEXT NOT NULL,
    "buyer_lastname" TEXT NOT NULL,
    "purchase_date" TIMESTAMPTZ(6) NOT NULL,
    "lottery_programming_id" INTEGER NOT NULL,
    "seller_id" INTEGER NOT NULL,
    "ticket_type_id" INTEGER NOT NULL,

    CONSTRAINT "ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_type" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ticket_type_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "monazo_lottery_winner_number_lottery_programming_id_key" ON "monazo_lottery_winner_number"("lottery_programming_id");

-- CreateIndex
CREATE UNIQUE INDEX "parley_lottery_winner_number_lottery_programming_id_key" ON "parley_lottery_winner_number"("lottery_programming_id");

-- CreateIndex
CREATE UNIQUE INDEX "reventado_lottery_winner_number_lottery_programming_id_key" ON "reventado_lottery_winner_number"("lottery_programming_id");

-- AddForeignKey
ALTER TABLE "bet_ball" ADD CONSTRAINT "bet_number_id" FOREIGN KEY ("bet_number_id") REFERENCES "bet_number"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "bet_ball" ADD CONSTRAINT "ball_type_id" FOREIGN KEY ("ball_type_id") REFERENCES "ball_type"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "bet_number" ADD CONSTRAINT "ticket_id" FOREIGN KEY ("ticket_id") REFERENCES "ticket"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "bet_number" ADD CONSTRAINT "bet_number_type_id" FOREIGN KEY ("bet_number_type_id") REFERENCES "bet_number_type"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "lottery_monazo_type" ADD CONSTRAINT "lottery_id" FOREIGN KEY ("lottery_id") REFERENCES "lottery"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "lottery_monazo_type" ADD CONSTRAINT "monazo_type_id" FOREIGN KEY ("monazo_type_id") REFERENCES "monazo_type"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "lottery_prize" ADD CONSTRAINT "lottery_id" FOREIGN KEY ("lottery_id") REFERENCES "lottery"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "lottery_winner_number" ADD CONSTRAINT "lottery_programming_id" FOREIGN KEY ("lottery_programming_id") REFERENCES "lottery_programming"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "lottery_winner_number" ADD CONSTRAINT "lottery_prize_id" FOREIGN KEY ("lottery_prize_id") REFERENCES "lottery_prize"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "monazo_bet_number" ADD CONSTRAINT "ticket_id" FOREIGN KEY ("ticket_id") REFERENCES "ticket"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "monazo_bet_number" ADD CONSTRAINT "monazo_type_id" FOREIGN KEY ("monazo_type_id") REFERENCES "monazo_type"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "monazo_lottery_winner_number" ADD CONSTRAINT "lottery_programming_id" FOREIGN KEY ("lottery_programming_id") REFERENCES "lottery_programming"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "parley_bet_number" ADD CONSTRAINT "ticket_id" FOREIGN KEY ("ticket_id") REFERENCES "ticket"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "parley_lottery" ADD CONSTRAINT "lottery_id" FOREIGN KEY ("lottery_id") REFERENCES "lottery"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "parley_lottery_winner_number" ADD CONSTRAINT "lottery_programming_id" FOREIGN KEY ("lottery_programming_id") REFERENCES "lottery_programming"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "reventado_lottery" ADD CONSTRAINT "lottery_id" FOREIGN KEY ("lottery_id") REFERENCES "lottery"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "reventado_lottery_ball_type" ADD CONSTRAINT "reventado_lottery_id" FOREIGN KEY ("reventado_lottery_id") REFERENCES "reventado_lottery"("lottery_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "reventado_lottery_ball_type" ADD CONSTRAINT "bet_ball_id" FOREIGN KEY ("ball_type_id") REFERENCES "ball_type"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "reventado_lottery_winner_number" ADD CONSTRAINT "lottery_programming_id" FOREIGN KEY ("lottery_programming_id") REFERENCES "lottery_programming"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "reventado_lottery_winner_number" ADD CONSTRAINT "ball_type_id" FOREIGN KEY ("ball_type_id") REFERENCES "ball_type"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "lottery_programming_id" FOREIGN KEY ("lottery_programming_id") REFERENCES "lottery_programming"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "seller_id" FOREIGN KEY ("seller_id") REFERENCES "seller"("user_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_type_id" FOREIGN KEY ("ticket_type_id") REFERENCES "ticket_type"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AlterTable
CREATE SEQUENCE bank_id_seq;
ALTER TABLE "bank" ALTER COLUMN "id" SET DEFAULT nextval('bank_id_seq');
ALTER SEQUENCE bank_id_seq OWNED BY "bank"."id";

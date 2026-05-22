-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "paid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "paystackRef" TEXT,
ADD COLUMN     "paystackResponse" JSONB;

/*
  Warnings:

  - You are about to drop the column `providerEventId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `rawPayload` on the `Payment` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Payment_providerEventId_key";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "providerEventId",
DROP COLUMN "rawPayload",
ADD COLUMN     "rawResponse" JSONB,
ALTER COLUMN "provider" SET DEFAULT 'konnect';

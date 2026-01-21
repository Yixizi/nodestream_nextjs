/*
  Warnings:

  - You are about to drop the column `errorStatus` on the `Execution` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Execution" DROP COLUMN "errorStatus",
ADD COLUMN     "errorStack" TEXT;

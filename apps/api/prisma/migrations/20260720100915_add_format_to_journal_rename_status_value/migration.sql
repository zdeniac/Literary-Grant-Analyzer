/*
  Warnings:

  - The values [CLOSED] on the enum `JournalStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "JournalFormat" AS ENUM ('ONLINE', 'PRINT');

-- AlterEnum
BEGIN;
CREATE TYPE "JournalStatus_new" AS ENUM ('ACTIVE', 'PAUSE', 'CEASED');
ALTER TABLE "Journal" ALTER COLUMN "status" TYPE "JournalStatus_new" USING ("status"::text::"JournalStatus_new");
ALTER TYPE "JournalStatus" RENAME TO "JournalStatus_old";
ALTER TYPE "JournalStatus_new" RENAME TO "JournalStatus";
DROP TYPE "public"."JournalStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Journal" ADD COLUMN     "format" "JournalFormat"[];

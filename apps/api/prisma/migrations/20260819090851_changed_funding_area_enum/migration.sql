/*
  Warnings:

  - The values [PERIODICAL] on the enum `FundingArea` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FundingArea_new" AS ENUM ('CREATIVE_WORK', 'PRINT_PERIODICAL', 'ONLINE_PERIODICAL', 'ONLINE_PRESENCE', 'EVENT', 'BOOK_PUBLISHING', 'TRANSLATION', 'RESEARCH', 'EDUCATION', 'RECOGNITION', 'OTHER');
ALTER TABLE "AwardScheme" ALTER COLUMN "fundingArea" TYPE "FundingArea_new" USING ("fundingArea"::text::"FundingArea_new");
ALTER TYPE "FundingArea" RENAME TO "FundingArea_old";
ALTER TYPE "FundingArea_new" RENAME TO "FundingArea";
DROP TYPE "public"."FundingArea_old";
COMMIT;

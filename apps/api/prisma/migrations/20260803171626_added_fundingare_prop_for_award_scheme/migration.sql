/*
  Warnings:

  - Added the required column `fundingArea` to the `AwardScheme` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AwardScheme" ADD COLUMN     "fundingArea" "FundingArea" NOT NULL;

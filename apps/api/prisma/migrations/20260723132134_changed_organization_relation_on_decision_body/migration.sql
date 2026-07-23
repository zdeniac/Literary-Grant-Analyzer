/*
  Warnings:

  - Made the column `organizationId` on table `DecisionBody` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "DecisionBody" ALTER COLUMN "organizationId" SET NOT NULL;

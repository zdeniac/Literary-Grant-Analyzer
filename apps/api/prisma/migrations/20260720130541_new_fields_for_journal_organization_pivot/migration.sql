/*
  Warnings:

  - A unique constraint covering the columns `[journalId,organizationId,fromYear]` on the table `JournalOrganization` will be added. If there are existing duplicate values, this will fail.
  - Made the column `fromYear` on table `JournalOrganization` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "JournalOrganization" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "sourceDocumentId" INTEGER,
ALTER COLUMN "fromYear" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "JournalOrganization_journalId_organizationId_fromYear_key" ON "JournalOrganization"("journalId", "organizationId", "fromYear");

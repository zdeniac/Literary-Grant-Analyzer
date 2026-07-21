/*
  Warnings:

  - You are about to drop the `JournalOrganization` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "JournalOrganization" DROP CONSTRAINT "JournalOrganization_journalId_fkey";

-- DropForeignKey
ALTER TABLE "JournalOrganization" DROP CONSTRAINT "JournalOrganization_organizationId_fkey";

-- DropTable
DROP TABLE "JournalOrganization";

-- CreateTable
CREATE TABLE "JournalAffiliation" (
    "id" SERIAL NOT NULL,
    "journalId" INTEGER NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "sourceDocumentId" INTEGER,
    "isCurrent" BOOLEAN NOT NULL DEFAULT true,
    "fromYear" INTEGER,
    "toYear" INTEGER,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JournalAffiliation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "JournalAffiliation" ADD CONSTRAINT "JournalAffiliation_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "Journal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalAffiliation" ADD CONSTRAINT "JournalAffiliation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalAffiliation" ADD CONSTRAINT "JournalAffiliation_sourceDocumentId_fkey" FOREIGN KEY ("sourceDocumentId") REFERENCES "SourceDocument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
